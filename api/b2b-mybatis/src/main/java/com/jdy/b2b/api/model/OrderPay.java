package com.jdy.b2b.api.model;

import com.jdy.b2b.api.common.BaseVO;

import java.math.BigDecimal;
import java.util.Date;

public class OrderPay extends BaseVO{
    private Long id;

    private Long opOrderId;

    private String opPayNo;

    private BigDecimal opPayAmount;

    private Integer opPayMethod;

    private String opComments;

    private String opOprater;

    private Date opPayTime;

    private Boolean oIsmerge;

    private Date createTime;

    private Long createUser;

    private Date updateTime;

    private Long updateUser;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOpOrderId() {
        return opOrderId;
    }

    public void setOpOrderId(Long opOrderId) {
        this.opOrderId = opOrderId;
    }

    public String getOpPayNo() {
        return opPayNo;
    }

    public void setOpPayNo(String opPayNo) {
        this.opPayNo = opPayNo == null ? null : opPayNo.trim();
    }

    public BigDecimal getOpPayAmount() {
        return opPayAmount;
    }

    public void setOpPayAmount(BigDecimal opPayAmount) {
        this.opPayAmount = opPayAmount;
    }

    public Integer getOpPayMethod() {
        return opPayMethod;
    }

    public void setOpPayMethod(Integer opPayMethod) {
        this.opPayMethod = opPayMethod;
    }

    public String getOpComments() {
        return opComments;
    }

    public void setOpComments(String opComments) {
        this.opComments = opComments == null ? null : opComments.trim();
    }

    public String getOpOprater() {
        return opOprater;
    }

    public void setOpOprater(String opOprater) {
        this.opOprater = opOprater == null ? null : opOprater.trim();
    }

    public Date getOpPayTime() {
        return opPayTime;
    }

    public void setOpPayTime(Date opPayTime) {
        this.opPayTime = opPayTime;
    }

    public Boolean getoIsmerge() {
        return oIsmerge;
    }

    public void setoIsmerge(Boolean oIsmerge) {
        this.oIsmerge = oIsmerge;
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