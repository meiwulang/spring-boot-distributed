package com.jdy.b2b.api.service.impl;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.*;

import com.jdy.b2b.api.dao.brand.BrandMapper;
import com.jdy.b2b.api.dao.product.ProductMapper;
import com.jdy.b2b.api.model.brand.Brand;
import com.jdy.b2b.api.model.diy.OrderFenxiaoUpdateDTO;
import com.jdy.b2b.api.model.product.Product;
import com.jdy.b2b.api.util.MQAssembleService;
import com.jdy.b2b.api.util.MQTransformationUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.task.TaskExecutor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.jdy.b2b.api.common.RandomStringUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.controller.ElectronicContractController;
import com.jdy.b2b.api.dao.OrderMapper;
import com.jdy.b2b.api.dao.electroniccontract.ContractTemplateInfoMapper;
import com.jdy.b2b.api.dao.electroniccontract.ElectronicContractMapper;
import com.jdy.b2b.api.dao.electroniccontract.ProductContractTemplateMapper;
import com.jdy.b2b.api.dao.electroniccontract.SignContractInfoMapper;
import com.jdy.b2b.api.model.Order;
import com.jdy.b2b.api.model.electroniccontract.*;
import com.jdy.b2b.api.service.ElectronicContractService;

/**
 * Created by zhangfofa on 2017/12/14.
 */
@Service
public class ElectronicContractServiceImpl implements ElectronicContractService {
    private final Logger logger = LoggerFactory.getLogger(ElectronicContractController.class);

    @Autowired
    private ContractTemplateInfoMapper contractTemplateInfoMapper;

    @Autowired
    private SignContractInfoMapper signContractInfoMapper;

    @Autowired
    private ElectronicContractMapper electronicContractMapper;

    @Autowired
    private ProductContractTemplateMapper pctMapper;

    @Autowired
    private OrderMapper orderMapper;

    @Autowired
    private OrderOperationServiceImpl orderOperationServiceImpl;

    @Autowired
    private ProductMapper productMapper;
    @Autowired
    private TaskExecutor taskExecutor;
    @Autowired
    MQAssembleService mqAssembleService;
    @Autowired
    BrandMapper brandMapper;

    @Override
    public int addContractTemplate(ContractTemplateInfo contractTemplateInfo) {
        Date dt = new Date();
        contractTemplateInfo.setCreateTime(dt);
        contractTemplateInfo.setUpdateTime(dt);
        return contractTemplateInfoMapper.insertSelective(contractTemplateInfo);
    }

    @Override
    public int addSignContractInfo(SignContractInfo signContractInfo) {
        SignContractInfo signContractInfoResult = signContractInfoMapper.selectSignContractInfoByOrderNo(signContractInfo.getOrderNo(), 0);
        if(!Objects.equals(signContractInfoResult, null)) {
            return 0;
        }
        Date dt = new Date();
        signContractInfo.setCreateTime(dt);
        signContractInfo.setUpdateTime(dt);
        return signContractInfoMapper.insertSelective(signContractInfo);
    }

    @Override
    public ResultBean querySignContractInfoByOrderNo(String orderNo, Integer status) {
        SignContractInfo signContractInfo = signContractInfoMapper.selectSignContractInfoByOrderNo(orderNo, status);
        if(Objects.equals(signContractInfo, null)) {
            return ResultBean.getErrorResult("未查询到签署合同信息");
        }
        return ResultBean.getIndexSuccessResult(signContractInfo);
    }

    @Override
    public List<ContractTemplateInfoExt> searchTmpList(ContractTemplateListDO vo) {
        return contractTemplateInfoMapper.searchTmpList(vo);
    }

    @Override
    public ResultBean bindProAndTmp(BindProAndTmpDO vo) {
        Product product = new Product();
        if(vo.getTid().longValue() == 0L) {
            pctMapper.deleteByPid(vo);
            product.setId(vo.getPid());
            product.setOfflineSignStatus(1);
            productMapper.updateByPrimaryKeySelective(product);
            Product temp = productMapper.selectByPrimaryKey(product.getId());
            Brand brand =temp.getpBrand()==null?null:brandMapper.selectByPrimaryKey(temp.getpBrand());
            taskExecutor.execute(() -> mqAssembleService.getMQClinet().syncProduct(MQTransformationUtils.transProduct(temp,brand)));
            return ResultBean.getSuccessResult();
        }
        product.setId(vo.getPid());
        product.setOfflineSignStatus(0);
        productMapper.updateByPrimaryKeySelective(product);
        Product temp = productMapper.selectByPrimaryKey(product.getId());
        Brand brand =temp.getpBrand()==null?null:brandMapper.selectByPrimaryKey(temp.getpBrand());
        taskExecutor.execute(() -> mqAssembleService.getMQClinet().syncProduct(MQTransformationUtils.transProduct(temp,brand)));
        pctMapper.deleteByPid(vo);
        ProductContractTemplate pct = new ProductContractTemplate();
        pct.setPid(vo.getPid());
        pct.settId(vo.getTid());
        pctMapper.insert(pct);
        return ResultBean.getSuccessResult();
    }

    @Override
    public ResultBean prodTempList(BindProAndTmpDO bindProAndTmpDO) {
        ProductContractListDTO res = new ProductContractListDTO();
        Product product = productMapper.selectByPrimaryKey(bindProAndTmpDO.getPid());
        ContractTemplateListDO contractTemplateListDO = new ContractTemplateListDO();
        contractTemplateListDO.setPcompanyId(bindProAndTmpDO.getPcompanyId());
        contractTemplateListDO.setPuDataLimit(bindProAndTmpDO.getPuDataLimit());
        List<ContractTemplateInfoExt> list = contractTemplateInfoMapper.prodTmpList(contractTemplateListDO);
        res.setList(list);
        ProductContractTemplate chosen = pctMapper.selectByPidAndCompanyId(bindProAndTmpDO.getPid(), bindProAndTmpDO.getPcompanyId());
        if (chosen != null) {
            res.setId(chosen.gettId());
        } else {
            if(product.getOfflineSignStatus().intValue() == 1) {
                res.setId(0L);
            }
        }
        return ResultBean.getSuccessResult(res);
    }

    @Override
    public ResultBean deleteTemp(Long id) {
        contractTemplateInfoMapper.deleteByPrimaryKey(id);
        return ResultBean.getSuccessResult();
    }


    @Override
    public ResultBean queryGenerateContractNeedInfoByOrderNo(String orderNo) {
        Map map = electronicContractMapper.selectGenerateContractNeedInfoByOrderNo(orderNo);
        List<TicketPrice> ticketPriceList = electronicContractMapper.selectTicketPriceByScheduleId((long)map.get("scheduleId"));
        BigDecimal adultPrice = null;
        BigDecimal childPrice = null;
        int adultTicketCount = 0;
        int childTicketCount = 0;
        if(!Objects.equals(ticketPriceList, null) && ticketPriceList.size()>0) {
            for(TicketPrice ticketPrice : ticketPriceList) {
                if(ticketPrice.getTicketType().intValue() == 0) {
                    adultPrice = ticketPrice.getTicketPrice();
                    adultTicketCount++;
                }
                if(ticketPrice.getTicketType().intValue() == 1) {
                    childPrice = ticketPrice.getTicketPrice();
                    childTicketCount++;
                }
            }
        }

        if(adultTicketCount > 1) {
            adultPrice = null;
        }
        if(childTicketCount > 1) {
            childPrice = null;
        }
        String adultPriceStr = null;
        String childPriceStr = null;
        if(!Objects.equals(adultPrice, null)) {
            adultPriceStr = adultPrice.toString();
        }
        if(!Objects.equals(childPrice, null)) {
            childPriceStr = childPrice.toString();
        }
        Date dt = (Date)map.get("startTime");
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String startTimeStr = sdf.format(dt);
        String[] startTimeYearMonthDayStr = startTimeStr.split("-");

        Calendar calendar=Calendar.getInstance();
        calendar.setTime(dt);
        int intervalDays = (int)map.get("totalDays")-1;
        calendar.add(Calendar.DATE, intervalDays);
        String endTimeStr = sdf.format(calendar.getTime());
        String[] endTimeYearMonthDayStr = endTimeStr.split("-");

        /*SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String payTimeStr = sdf2.format(map.get("payTime"));*/

        String contractNo = ("DZHT"+orderNo+ RandomStringUtil.getString(6));
        //组织生成合同数据
        JSONObject parameter = new JSONObject();
        parameter.put("contractNo", contractNo);                                                parameter.put("tourist", map.get("tourist"));
        parameter.put("idCardNum", map.get("idCardNum"));                                       parameter.put("touristTel", map.get("touristTel"));
        parameter.put("touristsNum", map.get("touristsNum").toString());                        parameter.put("startYear", startTimeYearMonthDayStr[0]);
        parameter.put("startMonth", startTimeYearMonthDayStr[1]);                               parameter.put("startDay", startTimeYearMonthDayStr[2]);
        parameter.put("startTime", startTimeStr);                                               parameter.put("endYear", endTimeYearMonthDayStr[0]);
        parameter.put("endMonth", endTimeYearMonthDayStr[1]);                                   parameter.put("endDay", endTimeYearMonthDayStr[2]);
        parameter.put("totalDays", map.get("totalDays").toString());                            parameter.put("totalNights", String.valueOf(intervalDays));
        parameter.put("totalTravelExpenses", map.get("totalTravelExpenses").toString());        /*parameter.put("payTime", payTimeStr);*/
        parameter.put("groupMinNum", map.get("groupMinNum").toString());                        parameter.put("saleTel", map.get("saleTel"));
        parameter.put("adultTicket", adultPriceStr);                                            parameter.put("childTicket", childPriceStr);
        parameter.put("routeName", map.get("routeName"));                                       parameter.put("routeNo", map.get("routeNo"));
        parameter.put("otherThing", map.get("supplementalAgreement"));

        GenerateContractNeedInfo generateContractNeedInfo = new GenerateContractNeedInfo();
        generateContractNeedInfo.setContractNo(contractNo);
        generateContractNeedInfo.setDocTitle(map.get("templateTitle").toString());
        generateContractNeedInfo.setTemplateNo(map.get("templateNo").toString());
        generateContractNeedInfo.setFontSize("10");
        generateContractNeedInfo.setFontType("0");
        generateContractNeedInfo.setParameterJsonString(parameter.toJSONString());
        return ResultBean.getIndexSuccessResult(generateContractNeedInfo);
    }

    @Override
    @Transactional
    public void customerSignContractCallback(CustomerSignContractCallback customerSignContractCallback) {
        //更新订单表游客合同签署信息
        electronicContractMapper.updateOrderContractSignInfoByContractNo(customerSignContractCallback.getContractNo());
        //更新合同
        signContractInfoMapper.customerSignContractCallback(customerSignContractCallback);
    }

    @Override
    public ResultBean queryCustomerSignContractNeedInfoByOrderNo(String orderNo) {
        CustomerSignContractNeedInfo customerSignContractNeedInfo = electronicContractMapper.selectCustomerSignContractNeedInfoByOrderNo(orderNo);
        return ResultBean.getIndexSuccessResult(customerSignContractNeedInfo);
    }

    @Override
    public ResultBean queryOrderByOrderNo(String orderNo) {
        Order order = orderMapper.selectOrderByOrderNo(orderNo);
        return  ResultBean.getIndexSuccessResult(order);
    }

    @Override
    public int updateCustomerTransactionNoByOrderNo(String customerTransactionNo, String orderNo) {
        return signContractInfoMapper.updateCustomerTransactionNoByOrderNo(customerTransactionNo, orderNo);
    }

    @Override
    public ResultBean queryContractViewAndDownloadUrlByOrderNo(String orderNo) {
        Map map = signContractInfoMapper.selectContractViewAndDownloadUrlByOrderNo(orderNo);
        return ResultBean.getIndexSuccessResult(map);
    }

    @Override
    public ResultBean querySignContractSimplenessInfoByOrderNo(String orderNo) {
        SignContract signContract = signContractInfoMapper.selectSignContractSimplenessInfoByOrderNo(orderNo);
        return ResultBean.getIndexSuccessResult(signContract);
    }

    @Override
    public int updateSignContractInfoByContractNo(SignContractInfo signContractInfo) {
        OrderFenxiaoUpdateDTO orderFenxiaoUpdateDTO = new OrderFenxiaoUpdateDTO();
        orderFenxiaoUpdateDTO.setContractNo(signContractInfo.getContractNo());
        orderFenxiaoUpdateDTO.setOrderNo(signContractInfo.getOrderNo());

        int result = signContractInfoMapper.updateSignContractInfoByContractNo(signContractInfo);
        if(result>0){
            logger.error("合同签署回调后再回调长沙");
            SignContractInfo s = signContractInfoMapper.selectSingContractByContractNo(signContractInfo.getContractNo());
            if(s!=null && s.getStatus().byteValue() == 3) {
                taskExecutor.execute(() -> orderOperationServiceImpl.syncTofenxiaoMall(orderFenxiaoUpdateDTO));
            }
        }
        return result;
    }

    @Override
    public ResultBean queryProductWhetherBindingContractByOrderNo(String orderNo) {
        ContractTemplateInfo contractTemplateInfo = electronicContractMapper.selectProductWhetherBindingContractByOrderNo(orderNo);
        if(Objects.equals(contractTemplateInfo, null)) {
            return ResultBean.getErrorResult();
        }
        return ResultBean.getIndexSuccessResult(contractTemplateInfo);
    }
}
