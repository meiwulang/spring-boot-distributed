package com.jdy.b2b.api.service.impl;

import java.util.Date;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jdy.b2b.api.dao.OrderPrePayMapper;
import com.jdy.b2b.api.dao.diy.OrderMapperDiy;
import com.jdy.b2b.api.model.Order;
import com.jdy.b2b.api.model.OrderPrePayDO;
import com.jdy.b2b.api.service.OrderPrePayService;

/**
 * Created by zhangfofa on 2017/10/31.
 */
@Service
public class OrderPrePayServiceImpl implements OrderPrePayService {

    @Autowired
    private OrderPrePayMapper orderPrePayMapper;

    @Autowired
    private OrderMapperDiy orderMapperDiy;

    @Override
    public int add(OrderPrePayDO orderPrePayDO) {
        OrderPrePayDO queryResult = orderPrePayMapper.selectByOrderNo(orderPrePayDO.getPpOrderNo());
        if(!Objects.equals(queryResult, null)) {
            orderPrePayMapper.deleteByOrderNo(orderPrePayDO.getPpOrderNo());
        }
        Order order = orderMapperDiy.selectOrderByOrderNo(orderPrePayDO.getPpOrderNo());
        orderPrePayDO.setPpUserid(order.getCreateUser());
        orderPrePayDO.setCreateTime(new Date());
        return orderPrePayMapper.insertSelective(orderPrePayDO);
    }

    @Override
    public int deleteByOrderNo(String orderNo) {
        return orderPrePayMapper.deleteByOrderNo(orderNo);
    }

    @Override
    public OrderPrePayDO queryByOrderNo(String orderNo) {
        return orderPrePayMapper.selectByOrderNo(orderNo);
    }
}
