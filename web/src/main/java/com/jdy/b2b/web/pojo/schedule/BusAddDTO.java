package com.jdy.b2b.web.pojo.schedule;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/8/1 15:57
 */
@ApiModel("添加车辆DTO")
public class BusAddDTO extends BaseVO{

    @ApiModelProperty("车辆数")
    @Min(1)
    @NotNull
    private Integer num;

    @ApiModelProperty("班期id")
    @NotNull
    private Long bScheduleId;

    @ApiModelProperty("座位数")
    @NotNull
    private Integer bSeatsNum;

    public Integer getNum() {
        return num;
    }

    public void setNum(Integer num) {
        this.num = num;
    }

    public Long getbScheduleId() {
        return bScheduleId;
    }

    public void setbScheduleId(Long bScheduleId) {
        this.bScheduleId = bScheduleId;
    }

    public Integer getbSeatsNum() {
        return bSeatsNum;
    }

    public void setbSeatsNum(Integer bSeatsNum) {
        this.bSeatsNum = bSeatsNum;
    }
}
