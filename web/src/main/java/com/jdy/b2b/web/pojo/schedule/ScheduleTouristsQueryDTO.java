package com.jdy.b2b.web.pojo.schedule;

import com.jdy.b2b.web.util.BaseVO;

/**
 * Created by zhangfofa on 2018/1/31.
 */
public class ScheduleTouristsQueryDTO extends BaseVO {

    private Long scheduleId;

    private Boolean export;

    private Byte status;

    public Byte getStatus() {
        return status;
    }

    public void setStatus(Byte status) {
        this.status = status;
    }


    public Long getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(Long scheduleId) {
        this.scheduleId = scheduleId;
    }

    public Boolean getExport() {
        return export;
    }

    public void setExport(Boolean export) {
        this.export = export;
    }
}
