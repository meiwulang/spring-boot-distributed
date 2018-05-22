package com.jdy.b2b.api.model.OrderSync;

import com.jdy.b2b.api.model.OrderPay;
import com.jdy.b2b.api.model.reports.OrdersReport;

/**
 * Created by Darker on 2018/01/20.
 */
public class OrderSyncDTO {
    OrderPay orderPay;

    OrdersReport ordersReport;


    public OrderPay getOrderPay() {
        return orderPay;
    }

    public void setOrderPay(OrderPay orderPay) {
        this.orderPay = orderPay;
    }

    public OrdersReport getOrdersReport() {
        return ordersReport;
    }

    public void setOrdersReport(OrdersReport ordersReport) {
        this.ordersReport = ordersReport;
    }
}
