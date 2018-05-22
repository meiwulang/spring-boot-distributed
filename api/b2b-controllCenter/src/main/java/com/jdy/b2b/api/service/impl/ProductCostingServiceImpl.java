package com.jdy.b2b.api.service.impl;

import com.github.pagehelper.PageHelper;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.ProductCostingCategoryDetailMapper;
import com.jdy.b2b.api.dao.ProductCostingTitleMapper;
import com.jdy.b2b.api.dao.schedule.ScheduleSettingMapper;
import com.jdy.b2b.api.model.*;
import com.jdy.b2b.api.model.schedule.ScheduleSetting;
import com.jdy.b2b.api.service.ProductCostingService;
import com.jdy.b2b.api.util.DataSyncUtils;
import com.jdy.b2b.api.util.MQAssembleService;
import com.jdy.b2b.api.util.MQTransformationUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.task.TaskExecutor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by zhangfofa on 2018/2/6.
 */
@Service
public class ProductCostingServiceImpl implements ProductCostingService {
    @Autowired
    private ProductCostingTitleMapper productCostingTitleMapper;
    @Autowired
    private ProductCostingCategoryDetailMapper productCostingCategoryDetailMapper;
    @Autowired
    MQAssembleService mqAssembleService;
    @Autowired
    TaskExecutor taskExecutor;
    @Autowired
    private ScheduleSettingMapper scheduleSettingMapper;

    @Override
    @Transactional
    public ResultBean addProductCosting(ProductCosting productCosting, Long id) {
        if (productCosting.getProductCostingTitle().getType().intValue() == 2) {
            /*已结团的班期不再生成产品成本核算表*/
            GenerateCostingInformation generateCostingInformation = productCostingTitleMapper.selectGenerateCostingInformationByScheduleId(productCosting.getProductCostingTitle().getRelId());
            if(!(generateCostingInformation.getDepartureStatus().intValue() == 3)) {
                return ResultBean.getErrorResult("该班期不是回团状态，暂不允许生成核算单！");
            }
        }
        long createUser = productCosting.getPuserId();
        productCosting.getProductCostingTitle().setCreateUser(createUser);
        for (ProductCostingCategoryDetail productCostingCategoryDetail : productCosting.getProductCostingCategoryDetailList()) {
            productCostingCategoryDetail.setCreateUser(createUser);
        }
        productCostingTitleMapper.insertSelective(productCosting.getProductCostingTitle());
        productCostingCategoryDetailMapper.batchInsert(productCosting.getProductCostingCategoryDetailList(), productCosting.getProductCostingTitle().getId());

        taskExecutor.execute(() -> mqAssembleService.getMQClinet().syncScheduleInfo(MQTransformationUtils.transScheuleInfo(scheduleSettingMapper.queryScheduleInfo(null, productCosting.getProductCostingTitle().getId(), null))));

        DataSyncUtils.getInstance().syncProductCostData(this.productCostingTitleMapper.queryProductCostDTOById(productCosting.getProductCostingTitle().getId()));

        return ResultBean.getSuccessResult();
    }

    @Override
    public List<Map> queryCostingTitleList(CostingTitleDTO dto) {
        if (dto.getCurrPage() == null || dto.getCurrPage() == 0) {
            dto.setCurrPage(1);
        }
        PageHelper.startPage(dto.getCurrPage(), dto.getPageSize());
        return productCostingTitleMapper.queryCostingTitleList(dto);
    }

    @Override
    public List<Map> queryProductCostingTitleListById(ProductCostingQueryDTO productCostingQueryDTO) {
        if (productCostingQueryDTO.getCurrPage() == null || productCostingQueryDTO.getCurrPage() == 0) {
            productCostingQueryDTO.setCurrPage(1);
        }
        PageHelper.startPage(productCostingQueryDTO.getCurrPage(), productCostingQueryDTO.getPageSize());
        return productCostingTitleMapper.selectProductCostingTitleListById(productCostingQueryDTO);
    }

    @Override
    public ResultBean queryProductCostingAllInformationById(ProductCostingQueryDTO productCostingQueryDTO) {
        ProductCostingAllInformation productCostingAllInformation;
        if (productCostingQueryDTO.getType().intValue() == 1) {
            productCostingAllInformation = productCostingTitleMapper.selectProductCostingTitleByTypeAndId(productCostingQueryDTO);
            if (Objects.equals(productCostingAllInformation, null)) {
                return ResultBean.getErrorResult("暂未生成产品成本预算表！");
            }
        } else if (productCostingQueryDTO.getType().intValue() == 2) {
            productCostingQueryDTO.setProductId(null);
            productCostingAllInformation = productCostingTitleMapper.selectProductCostingTitleByTypeAndId(productCostingQueryDTO);
            if (Objects.equals(productCostingAllInformation, null)) {
                GenerateCostingInformation generateCostingInformation = productCostingTitleMapper.selectGenerateCostingInformationByScheduleId(productCostingQueryDTO.getScheduleId());
                productCostingQueryDTO.setScheduleId(null);
                productCostingQueryDTO.setProductId(generateCostingInformation.getProductId());
                productCostingQueryDTO.setType(1);
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd:HH:mm:ss");
                productCostingQueryDTO.setUpdateTime(sdf.format(generateCostingInformation.getUpdateTime()));
                productCostingAllInformation = productCostingTitleMapper.selectProductCostingTitleByTypeAndId(productCostingQueryDTO);
            }
        } else {
            productCostingQueryDTO.setType(1);
            GenerateCostingInformation generateCostingInformation = productCostingTitleMapper.selectGenerateCostingInformationByScheduleId(productCostingQueryDTO.getScheduleId());
            productCostingQueryDTO.setScheduleId(null);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd:HH:mm:ss");
            productCostingQueryDTO.setUpdateTime(sdf.format(generateCostingInformation.getUpdateTime()));
            productCostingAllInformation = productCostingTitleMapper.selectProductCostingTitleByTypeAndId(productCostingQueryDTO);
            if (Objects.equals(productCostingAllInformation, null)) {
                return ResultBean.getErrorResult("暂未生成产品成本预算表！");
            }
        }

        List<ProductCostingCategoryInformation> productCostingCategoryInformationList = productCostingTitleMapper.selectProductCostingCategoryInformationById(productCostingAllInformation.getId());
        if (!Objects.equals(productCostingCategoryInformationList, null) && productCostingCategoryInformationList.size() > 0) {
            for (ProductCostingCategoryInformation productCostingCategoryInformation : productCostingCategoryInformationList) {
                BigDecimal sum = new BigDecimal(0);
                productCostingCategoryInformation.setListSize(productCostingCategoryInformation.getProductCostingCategoryDetailList().size());
                if (Objects.equals(productCostingCategoryInformation.getListSize(), null) && productCostingCategoryInformation.getListSize() > 0) {
                    for (ProductCostingCategoryDetail productCostingCategoryDetail : productCostingCategoryInformation.getProductCostingCategoryDetailList()) {
                        BigDecimal price = new BigDecimal(productCostingCategoryDetail.getAmount()).multiply(productCostingCategoryDetail.getUnitPrice());
                        sum = sum.add(price);
                    }
                    productCostingCategoryInformation.setSubtotal(sum);
                }
            }
        }
        productCostingAllInformation.setProductCostingCategoryInformationList(productCostingCategoryInformationList);
        return ResultBean.getSuccessResult(productCostingAllInformation);
    }

    @Override
    @Transactional
    public ResultBean modifyProductCostingTitle(ProductCostingTitle vo) {
        vo.setUpdateTime(new Date());
        vo.setUpdateUser(vo.getPuserId());
        int res = productCostingTitleMapper.updateByPrimaryKeySelective(vo);
        if (res > 0){
            if (vo.getStatus()!= null && vo.getStatus() == 1){
                ProductCostingTitle productCostingTitle = productCostingTitleMapper.selectByPrimaryKey(vo.getId());
                ScheduleSetting s = scheduleSettingMapper.selectByScheduleIdAndCompanyId(productCostingTitle.getRelId(),productCostingTitle.getCompanyId());
                //TODO 更新对应的团期状态为已结团
                ScheduleSetting setting = new ScheduleSetting();
                setting.setDepartureStatus(Integer.valueOf(2).byteValue());
                setting.setCancelTime(new Date());
                setting.setCancelUser(vo.getPuserId());
                setting.setId(s.getId());
                scheduleSettingMapper.updateDepartureStatus(setting);

                DataSyncUtils.getInstance().syncProductCostData(this.productCostingTitleMapper.queryProductCostDTOById(productCostingTitle.getId()));
            }
            return ResultBean.getSuccessResult();
        }
        return ResultBean.getErrorResult("审核成本失败");
    }

    @Override
    public BigDecimal selectNewestCostUnitPriceByProductId(Long productId) {
        return productCostingTitleMapper.selectNewestCostUnitPriceByProductId(productId);
    }
    @Override
    public BigDecimal selectNewestCostUnitPriceByProductIdAndDate(Long productId,Date date) {
    	return productCostingTitleMapper.selectNewestCostUnitPriceByProductIdAndDate(productId,date);
    }
}
