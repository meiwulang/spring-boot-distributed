package com.jdy.b2b.api.dto;

import com.jdy.b2b.api.common.BaseVO;

import java.math.BigDecimal;
import java.util.Date;

/**
 * Created by yangcheng on 2018/2/28.
 */
public class OrderRefundRecordConfirmVO extends BaseVO{
    private Long orderId;
    private Integer status;
    private Date refundableTime;
    private BigDecimal refundAmount;

    public BigDecimal getRefundAmount() {
        return refundAmount;
    }

    public void setRefundAmount(BigDecimal refundAmount) {
        this.refundAmount = refundAmount;
    }

    public Date getRefundableTime() {
        return refundableTime;
    }

    public void setRefundableTime(Date refundableTime) {
        this.refundableTime = refundableTime;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }


    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}
