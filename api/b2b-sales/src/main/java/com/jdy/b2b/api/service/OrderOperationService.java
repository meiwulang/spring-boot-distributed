package com.jdy.b2b.api.service;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.Order;
import com.jdy.b2b.api.model.diy.*;
import com.jdy.b2b.api.model.orderRefund.OrderConfirm;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/9/19 16:33
 */
public interface OrderOperationService {

    ResultBean addOrder(OrderAddDTO order);

    ResultBean confirm(OrderConfirm order);

    ResultBean cancel(OrderCancelVO cancelVO);

    ResultBean sendSMS(Order order);

    ResultBean wxPay(OrderWxPayVO pay);

    void saveOrderLog(Order order, String opd, String remark);

    ResultBean validateCard(CardValidateVO vo);

    ResultBean validateFailBeforPay(ValidateFailDO vo);
}
