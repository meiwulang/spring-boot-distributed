package com.jdy.b2b.web.pojo.schedule;


import com.jdy.b2b.web.pojo.order.OrderTripDTO;
import com.jdy.b2b.web.util.BaseVO;
import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.Valid;
import java.util.Date;
import java.util.List;

/**
 * Created by dugq on 2018/1/30.
 */
public class ScheduleSettingDto extends BaseVO{
    @Valid
    private ScheduleSetting scheduleSetting;
    @Valid @NotEmpty
    private List<ScheduleFlight> scheduleFlightList;
    private List<OrderTripDTO> trips;
    private String pSpecial;
    private String pNotes;

    //行程天数
    private Integer pDays;
    private String pCostInclude;
    private String pCostExclude;
    private Date sCalendar;

    public ScheduleSetting getScheduleSetting() {
        return scheduleSetting;
    }

    public void setScheduleSetting(ScheduleSetting scheduleSetting) {
        this.scheduleSetting = scheduleSetting;
    }

    public List<ScheduleFlight> getScheduleFlightList() {
        return scheduleFlightList;
    }

    public void setScheduleFlightList(List<ScheduleFlight> scheduleFlightList) {
        this.scheduleFlightList = scheduleFlightList;
    }

    public List<OrderTripDTO> getTrips() {
        return trips;
    }

    public void setTrips(List<OrderTripDTO> trips) {
        this.trips = trips;
    }

    public String getpSpecial() {
        return pSpecial;
    }

    public void setpSpecial(String pSpecial) {
        this.pSpecial = pSpecial;
    }

    public String getpNotes() {
        return pNotes;
    }

    public void setpNotes(String pNotes) {
        this.pNotes = pNotes;
    }

    public Integer getpDays() {
        return pDays;
    }

    public void setpDays(Integer pDays) {
        this.pDays = pDays;
    }

    public String getpCostInclude() {
        return pCostInclude;
    }

    public void setpCostInclude(String pCostInclude) {
        this.pCostInclude = pCostInclude;
    }

    public String getpCostExclude() {
        return pCostExclude;
    }

    public void setpCostExclude(String pCostExclude) {
        this.pCostExclude = pCostExclude;
    }

    public Date getsCalendar() {
        return sCalendar;
    }

    public void setsCalendar(Date sCalendar) {
        this.sCalendar = sCalendar;
    }
}
