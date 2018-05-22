package com.jdy.b2b.api.model;

import java.util.Date;

/**
 * Created by zhangfofa on 2018/2/8.
 */
public class GenerateCostingInformation {

    private Long productId;

    private Date updateTime;

    private Integer departureStatus;

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public Integer getDepartureStatus() {
        return departureStatus;
    }

    public void setDepartureStatus(Integer departureStatus) {
        this.departureStatus = departureStatus;
    }
}
