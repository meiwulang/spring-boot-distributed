package com.jdy.b2b.api.model.bill;

import com.jdy.b2b.api.model.Order;
import com.jdy.b2b.api.model.OrderPay;

import java.math.BigDecimal;

/**
 * Created by dugq on 2017/9/27.
 */
public class OrderPayWithOrderDto extends OrderPay{
    private Order order;
    //佣金
    private BigDecimal csSettlementRate;
    //扫码手续费
    private BigDecimal csQrRate;

    //网易手续费
    private BigDecimal csBankRate;

    public BigDecimal getCsBankRate() {
        return csBankRate;
    }

    public void setCsBankRate(BigDecimal csBankRate) {
        this.csBankRate = csBankRate;
    }

    public BigDecimal getCsSettlementRate() {
        return csSettlementRate;
    }

    public void setCsSettlementRate(BigDecimal csSettlementRate) {
        this.csSettlementRate = csSettlementRate;
    }

    public BigDecimal getCsQrRate() {
        return csQrRate;
    }

    public void setCsQrRate(BigDecimal csQrRate) {
        this.csQrRate = csQrRate;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }
}
