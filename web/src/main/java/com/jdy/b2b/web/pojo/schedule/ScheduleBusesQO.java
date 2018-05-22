package com.jdy.b2b.web.pojo.schedule;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/8/1 15:31
 */
@ApiModel("班期车辆查询QO")
public class ScheduleBusesQO {

    @NotNull
    @ApiModelProperty("班期id")
    private Long bScheduleId;

    public Long getbScheduleId() {
        return bScheduleId;
    }

    public void setbScheduleId(Long bScheduleId) {
        this.bScheduleId = bScheduleId;
    }
}
