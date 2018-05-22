package com.jdy.b2b.web.pojo.schedule;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/9/29 19:10
 */
@ApiModel(description = "接送站点信息")
public class DepartureWithStopsDTO extends ShuttleBus {

    @ApiModelProperty(value = "始发站名称")
    private String departureName;
    @ApiModelProperty(value = "停靠站名称")
    private String stopName;
    @ApiModelProperty(value = "类型 0:始发站 1:顺路站 2:班车站")
    private Integer dType;

    public String getDepartureName() {
        return departureName;
    }

    public void setDepartureName(String departureName) {
        this.departureName = departureName;
    }

    public String getStopName() {
        return stopName;
    }

    public void setStopName(String stopName) {
        this.stopName = stopName;
    }

    public Integer getdType() {
        return dType;
    }

    public void setdType(Integer dType) {
        this.dType = dType;
    }
}
