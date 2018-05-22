package com.jdy.b2b.api.model.diy;

import com.jdy.b2b.api.model.Schedule;

import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/19 14:50
 */
public class ScheduleWithTicketsDTO extends Schedule {

    private List<TicketDTO> tickets;

    public List<TicketDTO> getTickets() {
        return tickets;
    }

    private String shifa;
    private String chufa;

    public void setTickets(List<TicketDTO> tickets) {
        this.tickets = tickets;
    }

    public String getShifa() {
        return shifa;
    }

    public void setShifa(String shifa) {
        this.shifa = shifa;
    }

    public String getChufa() {
        return chufa;
    }

    public void setChufa(String chufa) {
        this.chufa = chufa;
    }
}
