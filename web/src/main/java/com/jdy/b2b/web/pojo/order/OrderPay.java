package com.jdy.b2b.web.pojo.order;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.math.BigDecimal;
import java.util.Date;

@ApiModel(description = "订单支付记录")
public class OrderPay extends BaseVO {
    private Long id;

    @ApiModelProperty(value = "订单id")
    private Long opOrderId;

    @ApiModelProperty(value = "支付单号")
    private String opPayNo;

    @ApiModelProperty(value = "支付金额")
    private BigDecimal opPayAmount;

    @ApiModelProperty(value = "支付方式 0:在线支付 1:信用支付 2:线下支付")
    private Integer opPayMethod;

    @ApiModelProperty(value = "操作说明")
    private String opComments;

    @ApiModelProperty(value = "操作人")
    private String opOprater;

    @ApiModelProperty(value = "线下支付日期设置")
    private Date opPayTime;

    @ApiModelProperty(value = "是否加入到账单 0:未加入 1:加入")
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