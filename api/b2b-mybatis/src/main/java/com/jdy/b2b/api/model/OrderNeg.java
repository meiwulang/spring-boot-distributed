package com.jdy.b2b.api.model;

import java.util.Date;

public class OrderNeg {
    private Long id;

    private Long orderId;

    private Long negOrderId;
    private String negOrderNo;

    private Integer type;

    private Long createUser;

    private Date createTime;

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

    public Long getNegOrderId() {
        return negOrderId;
    }

    public void setNegOrderId(Long negOrderId) {
        this.negOrderId = negOrderId;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Long getCreateUser() {
        return createUser;
    }

    public void setCreateUser(Long createUser) {
        this.createUser = createUser;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getNegOrderNo() {
        return negOrderNo;
    }

    public void setNegOrderNo(String negOrderNo) {
        this.negOrderNo = negOrderNo;
    }
}