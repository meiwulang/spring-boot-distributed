package com.jdy.b2b.api.model.scheduleplan;

import java.time.LocalDate;

/**
 * Created by yangcheng on 2017/12/5.
 */
public class SchedulePlanDO {
    private LocalDate sCallendar;
    private Long otTicketId;
    private String tName;
    private Long peopleNum;
    private Integer flag;// 0 未付  1已付

    public LocalDate getsCallendar() {
        return sCallendar;
    }

    public void setsCallendar(LocalDate sCallendar) {
        this.sCallendar = sCallendar;
    }

    public Long getOtTicketId() {
        return otTicketId;
    }

    public void setOtTicketId(Long otTicketId) {
        this.otTicketId = otTicketId;
    }

    public String gettName() {
        return tName;
    }

    public void settName(String tName) {
        this.tName = tName;
    }

    public Long getPeopleNum() {
        return peopleNum;
    }

    public void setPeopleNum(Long peopleNum) {
        this.peopleNum = peopleNum;
    }

    public Integer getFlag() {
        return flag;
    }

    public void setFlag(Integer flag) {
        this.flag = flag;
    }
}
