package com.jdy.b2b.web.pojo.schedule;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Created by yangcheng on 2018/1/30.
 */
@ApiModel
public class ScheduleGuestDO {
    @ApiModelProperty(value = "游客id")
    private Long id;
    @ApiModelProperty(value = "游客状态 0: 有效 1 :无效")
    private Integer status;
    @ApiModelProperty(value = "票价类目名称")
    private String tCategory;
    @ApiModelProperty(value = "票价名称")
    private String tName;
    @ApiModelProperty(value = "游客姓名")
    private String touristName;
    @ApiModelProperty(value = "游客电话")
    private String touristTel;
    @ApiModelProperty(value = "票价")
    private BigDecimal tPrice;
    @ApiModelProperty(value = "订单号")
    private String orderNo;
    //格式化
    @JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")
    @ApiModelProperty(value = "支付时间")
    private LocalDateTime payTime;
    @ApiModelProperty(value = "取消原因")
    private String cancelReason;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String gettCategory() {
        return tCategory;
    }

    public void settCategory(String tCategory) {
        this.tCategory = tCategory;
    }

    public String gettName() {
        return tName;
    }

    public void settName(String tName) {
        this.tName = tName;
    }

    public String getTouristName() {
        return touristName;
    }

    public void setTouristName(String touristName) {
        this.touristName = touristName;
    }

    public String getTouristTel() {
        return touristTel;
    }

    public void setTouristTel(String touristTel) {
        this.touristTel = touristTel;
    }

    public BigDecimal gettPrice() {
        return tPrice;
    }

    public void settPrice(BigDecimal tPrice) {
        this.tPrice = tPrice;
    }

    public String getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(String orderNo) {
        this.orderNo = orderNo;
    }

    public LocalDateTime getPayTime() {
        return payTime;
    }

    public void setPayTime(LocalDateTime payTime) {
        this.payTime = payTime;
    }

    public String getCancelReason() {
        return cancelReason;
    }

    public void setCancelReason(String cancelReason) {
        this.cancelReason = cancelReason;
    }
}
