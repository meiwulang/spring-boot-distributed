package com.jdy.b2b.api.model.scheduleplan;

import com.github.pagehelper.PageInfo;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by yangcheng on 2017/12/5.
 */
public class SchedulePlanNewResult {
    private SchedulePlanCountDO countDO;
    private List<SchedulePlanQueryDO> list = new ArrayList<>();

    public SchedulePlanCountDO getCountDO() {
        return countDO;
    }

    public void setCountDO(SchedulePlanCountDO countDO) {
        this.countDO = countDO;
    }

    public List<SchedulePlanQueryDO> getList() {
        return list;
    }

    public void setList(List<SchedulePlanQueryDO> list) {
        this.list = list;
    }
}
