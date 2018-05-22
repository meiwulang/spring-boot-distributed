package com.jdy.b2b.api.model.alterTicket;

import com.jdy.b2b.api.model.Schedule;

import java.util.List;

/**
 * Created by strict on 2018/5/2.
 */
public class OrderAlterQueryScheduleListDTO {
    private String date;
    private List<Schedule> scheduleList;

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public List<Schedule> getScheduleList() {
        return scheduleList;
    }

    public void setScheduleList(List<Schedule> scheduleList) {
        this.scheduleList = scheduleList;
    }
}
