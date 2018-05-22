package com.jdy.b2b.web.pojo.orderRefund;

import java.math.BigDecimal;
import java.util.Date;

/**
 * Created by yangcheng on 2017/8/29.
 */
public class OrderRefundResultDO {
    private Long id;

    private String orOrderNo;

    private Long orProductId;

    private String orProductName;

    private String orProductNo;

    private String orSalerName;

    private String orBuyerName;

    private BigDecimal orRefund;

    private String orReason;

    private String orRemark;

    private Boolean orStauts;

    private Integer opPayMethod;

    private String orLabelId;

    private String lName;

    private String lColor;

    private String leaveDayStr;

    public String getLeaveDayStr() {
        return leaveDayStr;
    }

    public void setLeaveDayStr(String leaveDayStr) {
        this.leaveDayStr = leaveDayStr;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrOrderNo() {
        return orOrderNo;
    }

    public void setOrOrderNo(String orOrderNo) {
        this.orOrderNo = orOrderNo;
    }

    public Long getOrProductId() {
        return orProductId;
    }

    public void setOrProductId(Long orProductId) {
        this.orProductId = orProductId;
    }

    public String getOrProductName() {
        return orProductName;
    }

    public void setOrProductName(String orProductName) {
        this.orProductName = orProductName;
    }

    public String getOrProductNo() {
        return orProductNo;
    }

    public void setOrProductNo(String orProductNo) {
        this.orProductNo = orProductNo;
    }

    public String getOrSalerName() {
        return orSalerName;
    }

    public void setOrSalerName(String orSalerName) {
        this.orSalerName = orSalerName;
    }

    public String getOrBuyerName() {
        return orBuyerName;
    }

    public void setOrBuyerName(String orBuyerName) {
        this.orBuyerName = orBuyerName;
    }

    public BigDecimal getOrRefund() {
        return orRefund;
    }

    public void setOrRefund(BigDecimal orRefund) {
        this.orRefund = orRefund;
    }

    public String getOrReason() {
        return orReason;
    }

    public void setOrReason(String orReason) {
        this.orReason = orReason;
    }

    public String getOrRemark() {
        return orRemark;
    }

    public void setOrRemark(String orRemark) {
        this.orRemark = orRemark;
    }

    public Boolean getOrStauts() {
        return orStauts;
    }

    public void setOrStauts(Boolean orStauts) {
        this.orStauts = orStauts;
    }

    public Integer getOpPayMethod() {
        return opPayMethod;
    }

    public void setOpPayMethod(Integer opPayMethod) {
        this.opPayMethod = opPayMethod;
    }

    public String getOrLabelId() {
        return orLabelId;
    }

    public void setOrLabelId(String orLabelId) {
        this.orLabelId = orLabelId;
    }

    public String getlName() {
        return lName;
    }

    public void setlName(String lName) {
        this.lName = lName;
    }

    public String getlColor() {
        return lColor;
    }

    public void setlColor(String lColor) {
        this.lColor = lColor;
    }
}
