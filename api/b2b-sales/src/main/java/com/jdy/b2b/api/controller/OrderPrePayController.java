package com.jdy.b2b.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.OrderPrePayDO;
import com.jdy.b2b.api.service.OrderPrePayService;

/**
 * Created by zhangfofa on 2017/10/31.
 */
@Controller
@RequestMapping("/orderPrePay")
public class OrderPrePayController {

    @Autowired
    private OrderPrePayService orderPrePayService;

    @RequestMapping("/add")
    @ResponseBody
    public ResultBean add(@RequestBody OrderPrePayDO orderPrePayDO) {
        int addResult = orderPrePayService.add(orderPrePayDO);
        if(addResult < 1) {
            return ResultBean.getErrorResult();
        }
        return ResultBean.getSuccessResult();
    }

    @RequestMapping("/delete")
    @ResponseBody
    public ResultBean delete(@RequestBody String orderNo) {
        orderPrePayService.deleteByOrderNo(orderNo);
        return ResultBean.getSuccessResult();
    }

    @RequestMapping("/queryByOrderNo")
    @ResponseBody
    public ResultBean<OrderPrePayDO> queryByOrderNo(@RequestBody String orderNo) {
        OrderPrePayDO orderPrePayDO = orderPrePayService.queryByOrderNo(orderNo);
        return ResultBean.getSuccessResult(orderPrePayDO);
    }
}
