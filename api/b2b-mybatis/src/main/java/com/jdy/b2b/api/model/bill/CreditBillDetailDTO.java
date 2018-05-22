package com.jdy.b2b.api.model.bill;

import com.jdy.b2b.api.model.Order;
import com.jdy.b2b.api.model.OrderPay;

import java.util.List;

/**
 * Created by strict on 2017/9/19.
 */
public class CreditBillDetailDTO extends Bill{
    private List<Order>  orderList;
    private List<OrderPay> orderPayList;

    public List<Order> getOrderList() {
        return orderList;
    }

    public void setOrderList(List<Order> orderList) {
        this.orderList = orderList;
    }

    public List<OrderPay> getOrderPayList() {
        return orderPayList;
    }

    public void setOrderPayList(List<OrderPay> orderPayList) {
        this.orderPayList = orderPayList;
    }
}
