package com.jdy.b2b.web.pojo.schedule;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;

/**
 * Created by yangcheng on 2018/1/30.
 */
@ApiModel
public class ScheduleGuestQueryVO extends BaseVO{
    @ApiModelProperty(value = "班期id")
    @NotNull(message = "班期id不能为空!")
    private Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
