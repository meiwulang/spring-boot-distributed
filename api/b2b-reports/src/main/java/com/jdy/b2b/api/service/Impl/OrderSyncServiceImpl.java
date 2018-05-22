package com.jdy.b2b.api.service.Impl;


import com.jdy.b2b.api.dao.OrderPayMapper;
import com.jdy.b2b.api.dao.reports.OrdersReportMapper;
import com.jdy.b2b.api.model.OrderSync.OrderSyncDTO;
import com.jdy.b2b.api.service.OrderSyncService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by Darker on 2018/01/20.
 */
@Service
public class OrderSyncServiceImpl implements OrderSyncService {

    @Autowired
    OrderPayMapper orderPayMapper;

    @Autowired
    OrdersReportMapper ordersReportMapper;

    @Override
    public void save(OrderSyncDTO orderSyncDTO) {
        orderPayMapper.insertSelective(orderSyncDTO.getOrderPay());
        ordersReportMapper.insertSelective(orderSyncDTO.getOrdersReport());
    }
}
