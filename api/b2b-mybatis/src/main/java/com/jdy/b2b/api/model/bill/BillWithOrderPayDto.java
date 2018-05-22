package com.jdy.b2b.api.model.bill;

import java.math.BigDecimal;
import java.util.List;

/**
 * Created by dugq on 2017/9/27.
 */
public class BillWithOrderPayDto extends Bill {
    private BigDecimal commission; //佣金

    private List<OrderGroupByCompanyDto> orderPayGroupByCompanyDtos;
    private List<OrderWithOrderPay> orders;
    private BigDecimal csSettlementRate;
    private BigDecimal csQrRate;

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

    public List<OrderWithOrderPay> getOrders() {
        return orders;
    }

    public void setOrders(List<OrderWithOrderPay> orders) {
        this.orders = orders;
    }

    public BigDecimal getCommission() {
        return commission;
    }

    public void setCommission(BigDecimal commission) {
        this.commission = commission;
    }

    public List<OrderGroupByCompanyDto> getOrderPayGroupByCompanyDtos() {
        return orderPayGroupByCompanyDtos;
    }

    public void setOrderPayGroupByCompanyDtos(List<OrderGroupByCompanyDto> orderPayGroupByCompanyDtos) {
        this.orderPayGroupByCompanyDtos = orderPayGroupByCompanyDtos;
    }
}
