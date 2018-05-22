package com.jdy.b2b.api.model.bill;

import java.math.BigDecimal;

/**
 * Created by strict on 2017/9/1.
 */
public class BillTotalInfoDTO {

    private BigDecimal totalPayedAmount; //已还金额
    private BigDecimal totalAmount;      //总金额
    private BigDecimal totalBrokerage;   //手续费
    private BigDecimal totalDeduction;   //减免费用  用于一次性销帐时的优惠
    private Double progress;

    public Double getProgress() {
        return progress;
    }

    public void setProgress(Double progress) {
        this.progress = progress;
    }

    public BigDecimal getTotalPayedAmount() {
        return totalPayedAmount;
    }

    public void setTotalPayedAmount(BigDecimal totalPayedAmount) {
        this.totalPayedAmount = totalPayedAmount;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BigDecimal getTotalBrokerage() {
        return totalBrokerage;
    }

    public void setTotalBrokerage(BigDecimal totalBrokerage) {
        this.totalBrokerage = totalBrokerage;
    }

    public BigDecimal getTotalDeduction() {
        return totalDeduction;
    }

    public void setTotalDeduction(BigDecimal totalDeduction) {
        this.totalDeduction = totalDeduction;
    }
}
