package com.jdy.b2b.api.controller;

import com.jdy.b2b.api.common.BaseController;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.Order;
import com.jdy.b2b.api.model.diy.*;
import com.jdy.b2b.api.model.orderRefund.OrderConfirm;
import com.jdy.b2b.api.service.OrderOperationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @Description 订单操作
 * @Author yyf
 * @DateTime 2017/9/19 11:30
 */
@RestController
@RequestMapping("Order")
public class OrderOperationController extends BaseController {

    @Autowired
    OrderOperationService orderOperationService;

    @PostMapping("/addOrder")
    public ResultBean addOrder(@RequestBody OrderAddDTO order) {
        return orderOperationService.addOrder(order);
    }

    @PostMapping("/confirm")
    public ResultBean confirm(@RequestBody OrderConfirm order) {
        return orderOperationService.confirm(order);
    }

    @PostMapping("/wxPay")
    public ResultBean wxPay(@RequestBody OrderWxPayVO pay) {
        return orderOperationService.wxPay(pay);
    }

    @PostMapping("/validateFailBeforPay")
    public ResultBean validateFailBeforPay(@RequestBody ValidateFailDO vo) {
        return orderOperationService.validateFailBeforPay(vo);
    }

    @PostMapping("/cancel")
    public ResultBean cancel(@RequestBody OrderCancelVO cancelVO) {
        return orderOperationService.cancel(cancelVO);
    }

    @PostMapping("/sendSMS")
    public ResultBean sendSMS(@RequestBody Order order) {
        return orderOperationService.sendSMS(order);
    }

    @PostMapping("/validateCard")
    public ResultBean validateCard(@RequestBody CardValidateVO vo) {
        return orderOperationService.validateCard(vo);
    }
}
