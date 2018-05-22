package com.jdy.b2b.api.model.alterTicket;

import java.util.Date;
import java.util.List;

/**
 * Created by strict on 2018/5/2.
 */
public class OrderQueryScheduleByTicketVO {
    private List<Long> ticketList;

    private Date time;

    private Long oldScheduleId;

    private Boolean flag;//true 取 >=time ，false 取 =time 的数据

    public Long getOldScheduleId() {
        return oldScheduleId;
    }

    public void setOldScheduleId(Long oldScheduleId) {
        this.oldScheduleId = oldScheduleId;
    }

    public Boolean getFlag() {
        return flag;
    }

    public void setFlag(Boolean flag) {
        this.flag = flag;
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }

    public List<Long> getTicketList() {
        return ticketList;
    }

    public void setTicketList(List<Long> ticketList) {
        this.ticketList = ticketList;
    }
}
