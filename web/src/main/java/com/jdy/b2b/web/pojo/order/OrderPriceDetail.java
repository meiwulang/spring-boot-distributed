package com.jdy.b2b.web.pojo.order;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.math.BigDecimal;
import java.util.Date;

@ApiModel(description = "价格详情")
public class OrderPriceDetail extends BaseVO {
    private Long id;
    @ApiModelProperty(value = "订单id")
    private Long opOrderId;
    @ApiModelProperty(value = "价格名称")
    private String opPriceName;
    @ApiModelProperty(value = "数量")
    private Integer opNum;
    @ApiModelProperty(value = "单价")
    private BigDecimal opPrice;
    @ApiModelProperty(value = "总价")
    private BigDecimal opTotalPrice;
    @ApiModelProperty(value = "备注")
    private String opRemark;
    @ApiModelProperty(value = "类型 0:票价 1:房差 2:调整 3:活动 4:违约金 5:接送费")
    private Integer opType;
    @ApiModelProperty(value = "活动id")
    private Long opActivityId;
    @ApiModelProperty(value = "0:正常 1:删除")
    private Byte opStatus;

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
}