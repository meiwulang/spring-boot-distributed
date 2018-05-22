package com.jdy.b2b.api.model;

import java.math.BigDecimal;
import java.util.Date;

public class OrderPriceDetail {
    private Long id;

    private Long opOrderId;

    private Long opTicketId;

    private String opPriceName;

    private Integer opNum;

    private BigDecimal opPrice;

    private BigDecimal opTotalPrice;

    private String opRemark;

    private Integer opType;

    private Long opActivityId;

    private Byte opStatus;

    private Date createTime;

    private Long createUser;

    private Date updateTime;

    private Long updateUser;

    private Integer opAdultNum;
    private Integer opChildNum;

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

    public Long getOpTicketId() {
        return opTicketId;
    }

    public void setOpTicketId(Long opTicketId) {
        this.opTicketId = opTicketId;
    }

    public String getOpPriceName() {
        return opPriceName;
    }

    public void setOpPriceName(String opPriceName) {
        this.opPriceName = opPriceName == null ? null : opPriceName.trim();
    }

    public Integer getOpNum() {
        return opNum;
    }

    public void setOpNum(Integer opNum) {
        this.opNum = opNum;
    }

    public BigDecimal getOpPrice() {
        return opPrice;
    }

    public void setOpPrice(BigDecimal opPrice) {
        this.opPrice = opPrice;
    }

    public BigDecimal getOpTotalPrice() {
        return opTotalPrice;
    }

    public void setOpTotalPrice(BigDecimal opTotalPrice) {
        this.opTotalPrice = opTotalPrice;
    }

    public String getOpRemark() {
        return opRemark;
    }

    public void setOpRemark(String opRemark) {
        this.opRemark = opRemark == null ? null : opRemark.trim();
    }

    public Integer getOpType() {
        return opType;
    }

    public void setOpType(Integer opType) {
        this.opType = opType;
    }

    public Long getOpActivityId() {
        return opActivityId;
    }

    public void setOpActivityId(Long opActivityId) {
        this.opActivityId = opActivityId;
    }

    public Byte getOpStatus() {
        return opStatus;
    }

    public void setOpStatus(Byte opStatus) {
        this.opStatus = opStatus;
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

    public Integer getOpAdultNum() {
        return opAdultNum;
    }

    public void setOpAdultNum(Integer opAdultNum) {
        this.opAdultNum = opAdultNum;
    }

    public Integer getOpChildNum() {
        return opChildNum;
    }

    public void setOpChildNum(Integer opChildNum) {
        this.opChildNum = opChildNum;
    }
}