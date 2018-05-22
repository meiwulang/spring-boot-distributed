package com.jdy.b2b.api.service;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.Order;
import com.jdy.b2b.api.model.diy.OrderH5Vo;
import com.jdy.b2b.api.model.diy.OrderPayLine;

import java.util.List;
import java.util.Map;

/**
 * Created by strict on 2017/9/21.
 */
public interface OrderH5Service {
    Map<String,Object> queryOrderList(OrderH5Vo orderH5Vo);

    Map<String,Object> querySimpleOrderList(OrderH5Vo orderH5Vo);

    Map<String,Object> queryOrderDetail(OrderH5Vo orderH5Vo);

    Map<String,Object> queryOrderInfo(OrderH5Vo orderH5Vo);

    Map<String,Object> queryOrderInfoBeforeConfirm(String no);

    ResultBean updateContractAgreement(Order order);

    List<OrderPayLine> orderPayList(Order order);

}
