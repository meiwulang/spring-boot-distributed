package com.jdy.b2b.api.model.bill;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jdy.b2b.api.model.Order;
import com.jdy.b2b.api.model.OrderPay;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;

/**
 * Created by dugq on 2017/9/27.
 */
public class OrderWithOrderPay extends Order{
    List<OrderPay> orderPayList ;
    private String phone;
    private BigDecimal opPayAmounts;  //总额
    private BigDecimal bBrokerages;  //手续费
    private BigDecimal commissions; //佣金
    private BigDecimal bPayedAmount; //已付金额
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;
    private Integer days;
    private String productName;

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Integer getDays() {
        return days;
    }

    public void setDays(Integer days) {
        this.days = days;
    }

    public BigDecimal getOpPayAmounts() {
        return opPayAmounts;
    }

    public void setOpPayAmounts(BigDecimal opPayAmounts) {
        this.opPayAmounts = opPayAmounts;
    }

    public BigDecimal getbBrokerages() {
        return bBrokerages;
    }

    public void setbBrokerages(BigDecimal bBrokerages) {
        this.bBrokerages = bBrokerages;
    }

    public BigDecimal getCommissions() {
        return commissions;
    }

    public void setCommissions(BigDecimal commissions) {
        this.commissions = commissions;
    }

    public BigDecimal getbPayedAmount() {
        return bPayedAmount;
    }

    public void setbPayedAmount(BigDecimal bPayedAmount) {
        this.bPayedAmount = bPayedAmount;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public List<OrderPay> getOrderPayList() {
        return orderPayList;
    }

    public void setOrderPayList(List<OrderPay> orderPayList) {
        this.orderPayList = orderPayList;
    }
}
