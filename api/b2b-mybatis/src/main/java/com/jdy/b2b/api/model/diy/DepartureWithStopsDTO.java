package com.jdy.b2b.api.model.diy;

import com.jdy.b2b.api.model.station.ShuttleBus;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/9/29 19:10
 */
public class DepartureWithStopsDTO extends ShuttleBus {

    private String departureName;
    private String stopName;
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
