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
@ApiModel("改变车辆座位数DTO")
public class BusChangeSeatNumDTO extends BaseVO{

    @ApiModelProperty("车辆id")
    @NotNull
    private Long id;

    @ApiModelProperty("座位数")
    @NotNull
    @Min(1)
    private Integer bSeatsNum;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getbSeatsNum() {
        return bSeatsNum;
    }

    public void setbSeatsNum(Integer bSeatsNum) {
        this.bSeatsNum = bSeatsNum;
    }
}