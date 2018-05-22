package com.jdy.b2b.web.pojo.schedule;

import com.jdy.b2b.web.pojo.departure.Departure;
import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/9/29 19:09
 */
@ApiModel(description = "接送站点信息")
public class ScheduleDeparturesDTO extends BaseVO {

    @ApiModelProperty(value = "始发站")
    private List<Departure> departures;

    @ApiModelProperty(value = "班车站、顺路站")
    private List<DepartureWithStopsDTO> departuresWithStops;

    public List<Departure> getDepartures() {
        return departures;
    }

    public void setDepartures(List<Departure> departures) {
        this.departures = departures;
    }

    public List<DepartureWithStopsDTO> getDeparturesWithStops() {
        return departuresWithStops;
    }

    public void setDeparturesWithStops(List<DepartureWithStopsDTO> departuresWithStops) {
        this.departuresWithStops = departuresWithStops;
    }
}
