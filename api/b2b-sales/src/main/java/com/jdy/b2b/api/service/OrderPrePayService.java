package com.jdy.b2b.api.service;

import com.jdy.b2b.api.model.OrderPrePayDO;

/**
 * Created by zhangfofa on 2017/10/31.
 */
public interface OrderPrePayService {

    int add(OrderPrePayDO orderPrePayDO);

    int deleteByOrderNo(String orderNo);

    OrderPrePayDO queryByOrderNo(String orderNo);
}
