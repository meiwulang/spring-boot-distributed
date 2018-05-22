package com.jdy.b2b.web.pojo.order.h5;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/9/26 19:48
 */
@ApiModel(description = "车座信息")
public class BusSeatH5 {
    @ApiModelProperty(value = "")
    private Long busId;
    @ApiModelProperty(value = "")
    private Integer bus;
    @ApiModelProperty(value = "")
    private List<Integer> num;

    public Long getBusId() {
        return busId;
    }

    public void setBusId(Long busId) {
        this.busId = busId;
    }

    public Integer getBus() {
        return bus;
    }

    public void setBus(Integer bus) {
        this.bus = bus;
    }

    public List<Integer> getNum() {
        return num;
    }

    public void setNum(List<Integer> num) {
        this.num = num;
    }
}
