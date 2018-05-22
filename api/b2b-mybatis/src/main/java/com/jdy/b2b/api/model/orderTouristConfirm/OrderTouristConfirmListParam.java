package com.jdy.b2b.api.model.orderTouristConfirm;

import com.jdy.b2b.api.common.BaseVO;
import org.apache.commons.lang3.ArrayUtils;

/**
 * Created by dugq on 2018/5/11.
 */
public class OrderTouristConfirmListParam extends BaseVO {
    private Long scheduleSettingId;

    private Boolean export;

    //确认游客列表适用  -1:所有 ，0 未确认 1-退票，2-改签 ，3- 已经确认
    private Integer[] status;

    private Boolean onlyNotConfirm;

    public Integer[] getStatus() {
        return status;
    }

    public void setStatus(Integer[] status) {
        this.status = status;
    }

    public Boolean getOnlyNotConfirm() {
        return status!=null && status.length == 1 && ArrayUtils.contains(status,0);
    }

    public void setOnlyNotConfirm(Boolean onlyNotConfirm) {
        this.onlyNotConfirm = onlyNotConfirm;
    }

    public Long getScheduleSettingId() {
        return scheduleSettingId;
    }

    public void setScheduleSettingId(Long scheduleSettingId) {
        this.scheduleSettingId = scheduleSettingId;
    }

    public Boolean getExport() {
        return export;
    }

    public void setExport(Boolean export) {
        this.export = export;
    }

}
