package com.jdy.b2b.web.pojo.orderTouristConfirm;

import com.jdy.b2b.web.util.BaseVO;

/**
 * Created by dugq on 2018/5/11.
 */
public class ConfirmTouristParam extends BaseVO {
    private Long touristId;
    private Integer status;
    private Long scheduleSettingId;

    public Long getScheduleSettingId() {
        return scheduleSettingId;
    }

    public void setScheduleSettingId(Long scheduleSettingId) {
        this.scheduleSettingId = scheduleSettingId;
    }
    public Long getTouristId() {
        return touristId;
    }

    public void setTouristId(Long touristId) {
        this.touristId = touristId;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}
