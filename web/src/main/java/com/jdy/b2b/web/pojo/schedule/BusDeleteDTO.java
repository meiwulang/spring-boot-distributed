package com.jdy.b2b.web.pojo.schedule;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/8/1 15:57
 */
@ApiModel("删除车辆DTO")
public class BusDeleteDTO extends BaseVO{

    @ApiModelProperty("班期id")
    @NotNull
    private Long bScheduleId;

    @ApiModelProperty("车辆id")
    @NotNull
    private Long id;

    public Long getbScheduleId() {
        return bScheduleId;
    }

    public void setbScheduleId(Long bScheduleId) {
        this.bScheduleId = bScheduleId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}