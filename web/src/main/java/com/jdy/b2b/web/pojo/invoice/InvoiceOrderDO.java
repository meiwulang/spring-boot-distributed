package com.jdy.b2b.web.pojo.invoice;

import java.math.BigDecimal;
import java.util.Date;

/**
 * Created by yangcheng on 2017/9/6.
 */
public class InvoiceOrderDO {
    private Long id;
    private Long oScheduleId;
    private String oOrderNo;
    private BigDecimal oInvoiceAmount;
    private BigDecimal oRealPay;
    private Date orderCreateTime;
    private String productName;
    private Date orderleaveTime;

    public BigDecimal getoRealPay() {
        return oRealPay;
    }

    public void setoRealPay(BigDecimal oRealPay) {
        this.oRealPay = oRealPay;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getoScheduleId() {
        return oScheduleId;
    }

    public void setoScheduleId(Long oScheduleId) {
        this.oScheduleId = oScheduleId;
    }

    public String getoOrderNo() {
        return oOrderNo;
    }

    public void setoOrderNo(String oOrderNo) {
        this.oOrderNo = oOrderNo;
    }

    public BigDecimal getoInvoiceAmount() {
        return oInvoiceAmount;
    }

    public void setoInvoiceAmount(BigDecimal oInvoiceAmount) {
        this.oInvoiceAmount = oInvoiceAmount;
    }

    public Date getOrderCreateTime() {
        return orderCreateTime;
    }

    public void setOrderCreateTime(Date orderCreateTime) {
        this.orderCreateTime = orderCreateTime;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Date getOrderleaveTime() {
        return orderleaveTime;
    }

    public void setOrderleaveTime(Date orderleaveTime) {
        this.orderleaveTime = orderleaveTime;
    }
}
