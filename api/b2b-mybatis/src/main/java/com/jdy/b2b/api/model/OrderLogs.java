package com.jdy.b2b.api.model;

import java.util.Date;

public class OrderLogs {
    private Long id;

    private Long olOrderId;

    private String olCompanyName;

    private Boolean olStatus;

    private Integer olOrderStatus;

    private String olOperater;

    private String olOperateDetail;

    private String olRemark;

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

    public Long getOlOrderId() {
        return olOrderId;
    }

    public void setOlOrderId(Long olOrderId) {
        this.olOrderId = olOrderId;
    }

    public String getOlCompanyName() {
        return olCompanyName;
    }

    public void setOlCompanyName(String olCompanyName) {
        this.olCompanyName = olCompanyName == null ? null : olCompanyName.trim();
    }

    public Boolean getOlStatus() {
        return olStatus;
    }

    public void setOlStatus(Boolean olStatus) {
        this.olStatus = olStatus;
    }

    public Integer getOlOrderStatus() {
        return olOrderStatus;
    }

    public void setOlOrderStatus(Integer olOrderStatus) {
        this.olOrderStatus = olOrderStatus;
    }

    public String getOlOperater() {
        return olOperater;
    }

    public void setOlOperater(String olOperater) {
        this.olOperater = olOperater == null ? null : olOperater.trim();
    }

    public String getOlOperateDetail() {
        return olOperateDetail;
    }

    public void setOlOperateDetail(String olOperateDetail) {
        this.olOperateDetail = olOperateDetail == null ? null : olOperateDetail.trim();
    }

    public String getOlRemark() {
        return olRemark;
    }

    public void setOlRemark(String olRemark) {
        this.olRemark = olRemark == null ? null : olRemark.trim();
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