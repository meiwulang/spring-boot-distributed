package com.jdy.b2b.api.model.orderRefund;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;
import java.util.Date;

public class OrderRefundsRecord {
    private Long id;

    private Long orderId;

    @JsonFormat(pattern = "yyyy年MM月dd日 HH:mm",timezone = "GMT+8")
    private Date applyRefundTime;
    @JsonFormat(pattern = "yyyy年MM月dd日 HH:mm",timezone = "GMT+8")
    private Date refundableTime;

    private Integer status;

    private Integer type;

    private Long refundableBuyerId;

    private String refundableBuyerName;

    private Long refundableSalerId;

    private String refundableSalerName;

    private BigDecimal applyAmount;

    private BigDecimal refundAmount;

    private String touristsId;

    private String ticketInfo;

    private String refundExplain;

    private Long negOrderId;

    private String negOrderNo;

    public Long getNegOrderId() {
        return negOrderId;
    }

    public void setNegOrderId(Long negOrderId) {
        this.negOrderId = negOrderId;
    }

    public String getNegOrderNo() {
        return negOrderNo;
    }

    public void setNegOrderNo(String negOrderNo) {
        this.negOrderNo = negOrderNo;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
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

    public Date getApplyRefundTime() {
        return applyRefundTime;
    }

    public void setApplyRefundTime(Date applyRefundTime) {
        this.applyRefundTime = applyRefundTime;
    }

    public Date getRefundableTime() {
        return refundableTime;
    }

    public void setRefundableTime(Date refundableTime) {
        this.refundableTime = refundableTime;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Long getRefundableBuyerId() {
        return refundableBuyerId;
    }

    public void setRefundableBuyerId(Long refundableBuyerId) {
        this.refundableBuyerId = refundableBuyerId;
    }

    public String getRefundableBuyerName() {
        return refundableBuyerName;
    }

    public void setRefundableBuyerName(String refundableBuyerName) {
        this.refundableBuyerName = refundableBuyerName == null ? null : refundableBuyerName.trim();
    }

    public Long getRefundableSalerId() {
        return refundableSalerId;
    }

    public void setRefundableSalerId(Long refundableSalerId) {
        this.refundableSalerId = refundableSalerId;
    }

    public String getRefundableSalerName() {
        return refundableSalerName;
    }

    public void setRefundableSalerName(String refundableSalerName) {
        this.refundableSalerName = refundableSalerName == null ? null : refundableSalerName.trim();
    }

    public BigDecimal getApplyAmount() {
        return applyAmount;
    }

    public void setApplyAmount(BigDecimal applyAmount) {
        this.applyAmount = applyAmount;
    }

    public BigDecimal getRefundAmount() {
        return refundAmount;
    }

    public void setRefundAmount(BigDecimal refundAmount) {
        this.refundAmount = refundAmount;
    }

    public String getTouristsId() {
        return touristsId;
    }

    public void setTouristsId(String touristsId) {
        this.touristsId = touristsId == null ? null : touristsId.trim();
    }

    public String getTicketInfo() {
        return ticketInfo;
    }

    public void setTicketInfo(String ticketInfo) {
        this.ticketInfo = ticketInfo == null ? null : ticketInfo.trim();
    }

    public String getRefundExplain() {
        return refundExplain;
    }

    public void setRefundExplain(String refundExplain) {
        this.refundExplain = refundExplain == null ? null : refundExplain.trim();
    }
}