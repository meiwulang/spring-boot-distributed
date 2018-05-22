package com.jdy.b2b.web.pojo.order;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.util.Date;

@ApiModel(description = "订单日志")
public class OrderLogs {
    private Long id;

    @ApiModelProperty(value = "订单id")
    private Long olOrderId;

    @ApiModelProperty(value = "供应商名称")
    private String olCompanyName;

    @ApiModelProperty(value = "状态;0:待处理 1:已处理")
    private Boolean olStatus;

    @ApiModelProperty(value = "状态 0:待确认 1:待付款 2:收款中 3:已付款 4:已退票")
    private Integer olOrderStatus;

    @ApiModelProperty(value = "操作人")
    private String olOperater;

    @ApiModelProperty(value = "操作明细")
    private String olOperateDetail;

    @ApiModelProperty(value = "备注")
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