package com.jdy.b2b.api.model.schedule;

import com.jdy.b2b.api.common.BaseVO;
import com.jdy.b2b.api.model.Base;
import com.jdy.b2b.api.model.diy.OrderTripDTO;

import java.util.Date;
import java.util.List;

/**
 * Created by dugq on 2018/1/30.
 */
public class ScheduleSettingDto extends BaseVO{
    private String pSpecial;
    private String pNotes;

    //行程天数
    private Integer pDays;
    private String pCostInclude;
    private String pCostExclude;
    private Date sCalendar;

    private ScheduleSetting scheduleSetting;
    private List<ScheduleFlight> scheduleFlightList;
    private List<OrderTripDTO> trips;


    public Date getsCalendar() {
        return sCalendar;
    }

    public void setsCalendar(Date sCalendar) {
        this.sCalendar = sCalendar;
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

    public List<OrderTripDTO> getTrips() {
        return trips;
    }

    public void setTrips(List<OrderTripDTO> trips) {
        this.trips = trips;
    }

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
}
