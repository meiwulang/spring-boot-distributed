package com.jdy.b2b.api.model.scheduleplan;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by yangcheng on 2017/12/5.
 */
public class SingleReserveSchedulePlan {
    private String sName = "预约";
    private Map<Long,Long> ttmap = new HashMap<>();  //票id--游客数量对应
    private Integer singleTotal;

    public Integer getSingleTotal() {
        return singleTotal;
    }

    public void setSingleTotal(Integer singleTotal) {
        this.singleTotal = singleTotal;
    }

    public void setsName(String sName) {
        this.sName = sName;
    }

    public String getsName() {
        return sName;
    }

    public Map<Long, Long> getTtmap() {
        return ttmap;
    }

    public void setTtmap(Map<Long, Long> ttmap) {
        this.ttmap = ttmap;
    }
}
