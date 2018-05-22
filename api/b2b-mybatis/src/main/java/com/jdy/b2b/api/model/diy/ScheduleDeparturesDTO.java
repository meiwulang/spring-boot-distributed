package com.jdy.b2b.api.model.diy;

import com.jdy.b2b.api.common.BaseVO;
import com.jdy.b2b.api.model.station.Departure;

import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/9/29 19:09
 */
public class ScheduleDeparturesDTO extends BaseVO {

    private List<Departure> departures;

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
