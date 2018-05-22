package com.jdy.b2b.api.model.scheduleplan;

import com.jdy.b2b.api.model.product.BaseDO;
import org.apache.commons.lang3.ArrayUtils;

import java.util.Objects;

/**
 * Created by zhangfofa on 2018/1/31.
 */
public class ScheduleTouristsQueryDTO extends BaseDO {

    private Long scheduleId;

    private Boolean export;


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
