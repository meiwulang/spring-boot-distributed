package com.jdy.b2b.api.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.BaseController;
import com.jdy.b2b.api.common.Constants;
import com.jdy.b2b.api.common.JSONUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.OrderMapper;
import com.jdy.b2b.api.model.Order;
import com.jdy.b2b.api.model.invoice.*;
import com.jdy.b2b.api.service.InvoiceService;
import com.jdy.b2b.api.vo.invoice.InvoiceQueryVo;
import com.jdy.b2b.api.vo.invoice.InvoiceSaveOrUpdateVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

/**
 * Created by yangcheng on 2017/9/1.
 *
 */
@RestController
@RequestMapping("invoice")
public class InvoiceController extends BaseController{
    @Autowired
    private InvoiceService invoiceService;
    @Autowired
    private OrderMapper orderMapper;

    /**
     * 新增或修改
     * @param vo
     * @return
     */
    @PostMapping("saveOrUpdate")
    @Transactional
    public ResultBean<Long> saveOrUpdateInvoie(@RequestBody InvoiceSaveOrUpdateVo vo){
        Invoice invoice = JSONUtil.trans(vo, Invoice.class);

        if(Objects.isNull(invoice.getId())){
            //新增发票,没有状态
            //插入发票,默认未处理状态
            invoice.setiStatus(Constants.INVOICE_NO_HANDLE);
            invoice.setCreateUser(vo.getPuserId());
            invoice.setCreateTime(new Date());
            invoice.setCreateName(vo.getpURealName());
            int result = invoiceService.saveInvoice(invoice);


            if(CollectionUtils.isEmpty(vo.getIdList())){
                throw new RuntimeException("订单id不能为空!!");
            }
            //批量保存中间表数据
            List<InvoiceDetail> detailList = new ArrayList<InvoiceDetail>(vo.getIdList().size());
            vo.getIdList().stream().forEach(orderId ->{
                InvoiceDetail detail = new InvoiceDetail();
                detail.setIdOrderId(orderId);
                detail.setIdInvoiceId(invoice.getId());
                detail.setCreateUser(vo.getPuserId());
                detail.setCreateTime(new Date());
                detailList.add(detail);
            });

            int detailResult  = invoiceService.saveInvoiceDetailBash(detailList);

            //更新订单可开票金额,如果是单个订单,先查询 后减  如果是多个 先判断开票金额是否等于总支付金额 然后同时置为0
            int r = 0;
            if(Integer.valueOf(1).equals(vo.getIdList().size())){
                //选择了一个订单
                Order order = orderMapper.selectByPrimaryKey(vo.getIdList().get(0));
                BigDecimal subtract = order.getoInvoiceAmount().subtract(invoice.getiAmount());
                if(subtract.intValue()>=0){
                    order.setoInvoiceAmount(subtract);
                    r = orderMapper.updateByPrimaryKeySelective(order);
                }else{
                    throw new RuntimeException("开发票金额大于已支付金额!!");
                }

            }else{
                //选择了多个订单
                //查询多个订单总金额
                BigDecimal total = invoiceService.getInvoiceAmountTotal(vo.getIdList());
                if(invoice.getiAmount().longValue() == total.longValue()){
                    //更新多个订单为0
                    r = invoiceService.updateInvoiceAmount(vo.getIdList());
                }else{
                    throw new RuntimeException("订单可开票总金额和开票金额不等!!");
                }

            }

            if(r>0 && result>0 && detailResult>0){
                return ResultBean.getSuccessResult(invoice.getId());
            }else{
                //return new ResultBean<Long>("-1","发票新增失败!");
                throw new RuntimeException("发票新增失败!");
            }
        }else{
            //处理
            invoice.setUpdateUser(vo.getPuserId());
            invoice.setUpdateTime(new Date());
            invoice.setUpdateName(vo.getpURealName());
            invoice.setiStatus(Constants.INVOICE_HANDLED);
            int result = invoiceService.updateInvoice(invoice);
            if(result>0){
                return ResultBean.getSuccessResult((long)result);
            }else{
                //return new ResultBean<Long>("-1","修改发票失败!");
                throw new RuntimeException("修改发票失败!");
            }
        }
    }

    /**
     * 编辑前查询  关联订单表
     * @param id
     * @return
     */
    @GetMapping("get/{id}")
    public ResultBean<InvoiceInfoDO> getInvoiceInfo(@PathVariable Long id){
        return ResultBean.getSuccessResult(invoiceService.getInvoiceInfo(id));
    }

    /**
     * 查列表
     * @param vo
     * @return
     */
    @PostMapping("list")
    public ResultBean<PageInfo<InvoiceListDO>> queryInvoicePage(@RequestBody InvoiceQueryVo vo){
        if (vo.getCurrPage() != null && vo.getPageSize() != null) {
            PageHelper.startPage(vo.getCurrPage(), vo.getPageSize());
        }
        //不限制状态
        InvoiceQueryDTO invoice = JSONUtil.trans(vo, InvoiceQueryDTO.class);
        List<InvoiceListDO> list = invoiceService.queryInvoicePage(invoice);
        return ResultBean.getSuccessResult(new PageInfo<InvoiceListDO>(list));
    }

    /**
     * 撤销发票 同步删除detail  还原订单可开票金额  只有待处理的可以撤销
     */
    @GetMapping("deleteDetail/{id}")
    @Transactional
    public ResultBean<Integer> deleteInvoiceAndDetail(@PathVariable Long id){
        Invoice invoice = new Invoice();
        invoice.setId(id);
        invoice.setiStatus(Constants.INVOICE_REVOKE);
        Invoice trans = JSONUtil.trans(invoice, Invoice.class);
        //撤销发票
        int result = invoiceService.updateInvoice(trans);
        //删除中间表
        //int detailResult = invoiceService.deleteInvoiceDetail(id);
        //还原订单可开票金额
        InvoiceInfoDO invoiceInfo = invoiceService.getInvoiceInfo(id);
        List<InvoiceOrderDO> orderList = invoiceInfo.getOrderList();
        int orderResult = 0;
        if(CollectionUtils.isEmpty(orderList)){
            throw new RuntimeException("删除发票失败");
        }else{
            if (orderList.size() == 1) {
                BigDecimal amount = invoiceInfo.getiAmount();
                Order order = new Order();
                order.setId(orderList.get(0).getId());
                order.setoInvoiceAmount(orderList.get(0).getoInvoiceAmount().add(amount));
                orderResult = orderMapper.updateByPrimaryKeySelective(order);
            }else if(orderList.size()>1){
                orderList.stream().forEach(o->{
                    o.setoInvoiceAmount(o.getoRealPay());
                });
                orderResult = invoiceService.updateBash(orderList);

            }
        }
        if(orderResult >0 && result>0){
            return ResultBean.getSuccessResult(result);
        }else{
            //return new ResultBean<Integer>("-1","删除发票失败!");
            throw new RuntimeException("删除发票失败");
        }
    }
}
