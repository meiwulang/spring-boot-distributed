package com.jdy.b2b.web.pojo.schedule;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.NotNull;

@ApiModel(description = "班期状态更新DTO")
public class ScheduleUpdateStatusDTO extends BaseVO{

    @ApiModelProperty("主键id")
    @NotNull
    private Long id;

    @ApiModelProperty("状态 0:正常 1:暂停 2:删除")
    @NotNull
    @Range(min = 0, max = 2)
    private Integer sStatus;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getsStatus() {
        return sStatus;
    }

    public void setsStatus(Integer sStatus) {
        this.sStatus = sStatus;
    }
}