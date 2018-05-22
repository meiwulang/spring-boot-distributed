package com.jdy.b2b.api.model.orderRefund;

import java.math.BigDecimal;
import java.util.Date;

public class OrderRefund {
    private Long id;

    private String orOrderNo;

    private Long orProductId;

    private String orProductName;

    private String orProductNo;

    private Long orSalerId;

    private String orSalerName;

    private Long orBuyerId;

    private String orBuyerName;

    private BigDecimal orRefund;

    private String orReason;

    private String orRemark;

    private Boolean orStauts;

    private Long orLabelId;

    private Date createTime;

    private Long createUser;

    private Date updateTime;

    private Long updateUser;

    public Long getOrLabelId() {
        return orLabelId;
    }

    public void setOrLabelId(Long orLabelId) {
        this.orLabelId = orLabelId;
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
        this.orOrderNo = orOrderNo == null ? null : orOrderNo.trim();
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
        this.orProductName = orProductName == null ? null : orProductName.trim();
    }

    public String getOrProductNo() {
        return orProductNo;
    }

    public void setOrProductNo(String orProductNo) {
        this.orProductNo = orProductNo == null ? null : orProductNo.trim();
    }

    public Long getOrSalerId() {
        return orSalerId;
    }

    public void setOrSalerId(Long orSalerId) {
        this.orSalerId = orSalerId;
    }

    public String getOrSalerName() {
        return orSalerName;
    }

    public void setOrSalerName(String orSalerName) {
        this.orSalerName = orSalerName == null ? null : orSalerName.trim();
    }

    public Long getOrBuyerId() {
        return orBuyerId;
    }

    public void setOrBuyerId(Long orBuyerId) {
        this.orBuyerId = orBuyerId;
    }

    public String getOrBuyerName() {
        return orBuyerName;
    }

    public void setOrBuyerName(String orBuyerName) {
        this.orBuyerName = orBuyerName == null ? null : orBuyerName.trim();
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
        this.orReason = orReason == null ? null : orReason.trim();
    }

    public String getOrRemark() {
        return orRemark;
    }

    public void setOrRemark(String orRemark) {
        this.orRemark = orRemark == null ? null : orRemark.trim();
    }

    public Boolean getOrStauts() {
        return orStauts;
    }

    public void setOrStauts(Boolean orStauts) {
        this.orStauts = orStauts;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Long getCreateUser() {
        return createUser;
    }

    public void setCreateUser(Long createUser) {
        this.createUser = createUser;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public Long getUpdateUser() {
        return updateUser;
    }

    public void setUpdateUser(Long updateUser) {
        this.updateUser = updateUser;
    }
}