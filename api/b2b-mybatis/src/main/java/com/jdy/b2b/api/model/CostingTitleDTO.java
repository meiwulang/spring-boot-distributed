package com.jdy.b2b.api.model;

import com.jdy.b2b.api.common.BaseVO;

/**
 * @Description
 * @Author yyf
 * @DateTime 2018/4/10 14:58
 */
public class CostingTitleDTO extends BaseVO{
    private Long scheduleId;

    public Long getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(Long scheduleId) {
        this.scheduleId = scheduleId;
    }
}
