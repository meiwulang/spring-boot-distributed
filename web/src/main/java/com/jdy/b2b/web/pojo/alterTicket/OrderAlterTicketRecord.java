package com.jdy.b2b.web.pojo.alterTicket;


import com.jdy.b2b.web.util.BaseVO;

import java.math.BigDecimal;
import java.util.Date;

public class OrderAlterTicketRecord extends BaseVO {
    private Long id;

    private Long orderId;

    private Long newOrderId;

    private Long targetScheduleId;

    private String targetGroupNo;

    private Integer status;

    private BigDecimal lossMoney;

    private Date createTime;

    private Long createUser;

    private Date updateTime;

    private Long updateUser;

    public Long getNewOrderId() {
        return newOrderId;
    }

    public void setNewOrderId(Long newOrderId) {
        this.newOrderId = newOrderId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getTargetScheduleId() {
        return targetScheduleId;
    }

    public void setTargetScheduleId(Long targetScheduleId) {
        this.targetScheduleId = targetScheduleId;
    }

    public String getTargetGroupNo() {
        return targetGroupNo;
    }

    public void setTargetGroupNo(String targetGroupNo) {
        this.targetGroupNo = targetGroupNo == null ? null : targetGroupNo.trim();
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public BigDecimal getLossMoney() {
        return lossMoney;
    }

    public void setLossMoney(BigDecimal lossMoney) {
        this.lossMoney = lossMoney;
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