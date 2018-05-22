package com.jdy.b2b.api.model.diy;

/**
 * Created by strict on 2018/3/1.
 */
public class OrderFirstAgentDTO {
    private Long orderId;
    private Long firstAgentId;
    private Integer isDirector;

    public Integer getIsDirector() {
        return isDirector;
    }

    public void setIsDirector(Integer isDirector) {
        this.isDirector = isDirector;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getFirstAgentId() {
        return firstAgentId;
    }

    public void setFirstAgentId(Long firstAgentId) {
        this.firstAgentId = firstAgentId;
    }
}
