package com.jdy.b2b.api.model.alterTicket;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jdy.b2b.api.common.BaseVO;

import java.math.BigDecimal;
import java.util.Date;

public class OrderAlterTicketRecord extends BaseVO{
    private Long id;

    private Long orderId;//原原订单ID

    private Long newOrderId;//新订单ID
    private Long negOrderId;//负订单
    private String newOrderNo;
    private String negOrderNo;

    private Long targetScheduleId;

    private String targetGroupNo;

    private Integer status;

    private BigDecimal lossMoney;

    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTime;

    private Long createUser;

    private String createUserName;

    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updateTime;

    private Long updateUser;

    private String updateUserName;

    public String getCreateUserName() {
        return createUserName;
    }

    public void setCreateUserName(String createUserName) {
        this.createUserName = createUserName;
    }

    public String getUpdateUserName() {
        return updateUserName;
    }

    public void setUpdateUserName(String updateUserName) {
        this.updateUserName = updateUserName;
    }

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

    public Long getNegOrderId() {
        return negOrderId;
    }

    public void setNegOrderId(Long negOrderId) {
        this.negOrderId = negOrderId;
    }

    public String getNewOrderNo() {
        return newOrderNo;
    }

    public void setNewOrderNo(String newOrderNo) {
        this.newOrderNo = newOrderNo;
    }

    public String getNegOrderNo() {
        return negOrderNo;
    }

    public void setNegOrderNo(String negOrderNo) {
        this.negOrderNo = negOrderNo;
    }
}