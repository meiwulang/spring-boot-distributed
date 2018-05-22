package com.jdy.b2b.api.dto;

import com.jdy.b2b.api.common.BaseVO;

/**
 * Created by yangcheng on 2018/2/28.
 */
public class OrderRefundRecordCloseVO extends BaseVO{
    private Long orderId;
    private Integer status;

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
