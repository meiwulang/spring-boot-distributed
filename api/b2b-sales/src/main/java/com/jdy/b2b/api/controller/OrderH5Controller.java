package com.jdy.b2b.api.controller;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.Order;
import com.jdy.b2b.api.model.diy.OrderH5Vo;
import com.jdy.b2b.api.model.diy.OrderPayLine;
import com.jdy.b2b.api.service.OrderH5Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.jdy.b2b.api.enums.UserDataLimitEnum.DATA_LIMIT_SYSTEM;
import static com.jdy.b2b.api.enums.UserDataLimitEnum.DATA_LIMIT_USER;

/**
 * Created by strict on 2017/9/21.
 */
@RestController
@RequestMapping("Order/m")
public class OrderH5Controller {

    @Autowired
    private OrderH5Service orderH5Service;
    /**
     * 订单列表
     * @return
     */
    @PostMapping("/queryList")
    public Object queryOrderListForH5(@RequestBody OrderH5Vo orderH5Vo){
        //只看当前登录者的订单
        orderH5Vo.setUserId(orderH5Vo.getPuserId());
        return orderH5Service.queryOrderList(orderH5Vo);
    }

    /**
     * 订单模糊搜索
     * @return
     */
    @PostMapping("/searchList")
    public Object searchOrderListForH5(@RequestBody OrderH5Vo orderH5Vo){
        if (!DATA_LIMIT_SYSTEM.equals(orderH5Vo.getPuDataLimit())){
            orderH5Vo.setCompanyId(orderH5Vo.getPcompanyId());
        }
        if (DATA_LIMIT_USER.equals(orderH5Vo.getPuDataLimit())){
            orderH5Vo.setUserId(orderH5Vo.getPuserId());
        }
        return orderH5Service.querySimpleOrderList(orderH5Vo);
    }

    /**
     * 订单详情
     * @return
     */
    @PostMapping("/orderDetail")
    public Object queryOrderDetailForH5(@RequestBody OrderH5Vo orderH5Vo){

        return orderH5Service.queryOrderDetail(orderH5Vo);
    }

    /**
     * 订单信息
     * @return
     */
    @PostMapping("/orderInfo")
    public Object queryOrderInfoForH5(@RequestBody OrderH5Vo orderH5Vo){

        return orderH5Service.queryOrderInfo(orderH5Vo);
    }

    /**
     * 下单付款前获取订单一些信息 包括 是否能信用支付 是否能微信支付等信息
     * @param no
     * @return
     */
    @GetMapping("/orderBeforeConfirm/{no}")
    public Object queryOrderInfoBeforeConfirmForH5(@PathVariable String no){
        return orderH5Service.queryOrderInfoBeforeConfirm(no);
    }

    @PostMapping("/updateContractAgreement")
    public ResultBean updateContractAgreement(@RequestBody Order order) {
        return orderH5Service.updateContractAgreement(order);
    }

    @PostMapping("orderPayList")
    public ResultBean orderPayList(@RequestBody Order order){
        List<OrderPayLine> orderPayLines = orderH5Service.orderPayList(order);
        return ResultBean.getSuccessResult(orderPayLines);
    }
}
