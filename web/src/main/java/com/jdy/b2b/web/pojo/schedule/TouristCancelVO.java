package com.jdy.b2b.web.pojo.schedule;

import java.util.List;

/**
 * Created by strict on 2018/1/30.
 */
public class TouristCancelVO {
    private List<Long> touristIds;
    private String remark;

    public List<Long> getTouristIds() {
        return touristIds;
    }

    public void setTouristIds(List<Long> touristIds) {
        this.touristIds = touristIds;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
}
