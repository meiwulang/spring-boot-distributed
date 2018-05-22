package com.jdy.b2b.web.pojo.order;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/9/6 17:35
 */
@ApiModel(description = "组团社确认单dto")
public class OrderTouristGroupConfirmationDTO extends OrderTourist {

    @ApiModelProperty(value = "去程始发站")
    private String lvDepartureName;
    @ApiModelProperty(value = "回程始发站")
    private String rtDepartureName;

    public String getLvDepartureName() {
        return lvDepartureName;
    }

    public void setLvDepartureName(String lvDepartureName) {
        this.lvDepartureName = lvDepartureName;
    }

    public String getRtDepartureName() {
        return rtDepartureName;
    }

    public void setRtDepartureName(String rtDepartureName) {
        this.rtDepartureName = rtDepartureName;
    }
}
