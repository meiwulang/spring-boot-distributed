package com.jdy.b2b.api.model.bill;

import com.jdy.b2b.api.model.Company;
import com.jdy.b2b.api.model.Order;

import java.math.BigDecimal;
import java.util.List;

/**
 * Created by dugq on 2017/9/27.
 */
public class OrderGroupByCompanyDto{
    private Company company;
    private List<OrderWithOrderPay> orders;

    private BigDecimal opPayAmounts;  //总额
    private BigDecimal bBrokerages;  //手续费
    private BigDecimal commissions; //佣金
    private BigDecimal bPayedAmount; //已付金额

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public List<OrderWithOrderPay> getOrders() {
        return orders;
    }

    public void setOrders(List<OrderWithOrderPay> orders) {
        this.orders = orders;
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
}
