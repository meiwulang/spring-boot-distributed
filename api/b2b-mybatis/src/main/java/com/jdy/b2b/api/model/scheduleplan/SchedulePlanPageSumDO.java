package com.jdy.b2b.api.model.scheduleplan;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by yangcheng on 2017/12/7.
 */
public class SchedulePlanPageSumDO {
    private Map<Long,Map<String,Long>> sumMap =new HashMap<>();

    public Map<Long, Map<String, Long>> getSumMap() {
        return sumMap;
    }

    public void setSumMap(Map<Long, Map<String, Long>> sumMap) {
        this.sumMap = sumMap;
    }
}

