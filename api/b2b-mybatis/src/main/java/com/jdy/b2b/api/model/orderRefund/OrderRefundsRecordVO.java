package com.jdy.b2b.api.model.orderRefund;

import com.jdy.b2b.api.common.BaseVO;

import java.math.BigDecimal;
import java.util.List;

/**
 * Created by strict on 2018/3/1.
 */
public class OrderRefundsRecordVO extends BaseVO{
    private Long orderId;
    private Integer type;
    private List<Long> touristIds;
    private String refundExplain;
    private BigDecimal applyRefundAmount;

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public List<Long> getTouristIds() {
        return touristIds;
    }

    public void setTouristIds(List<Long> touristIds) {
        this.touristIds = touristIds;
    }

    public String getRefundExplain() {
        return refundExplain;
    }

    public void setRefundExplain(String refundExplain) {
        this.refundExplain = refundExplain;
    }

    public BigDecimal getApplyRefundAmount() {
        return applyRefundAmount;
    }

    public void setApplyRefundAmount(BigDecimal applyRefundAmount) {
        this.applyRefundAmount = applyRefundAmount;
    }
}
