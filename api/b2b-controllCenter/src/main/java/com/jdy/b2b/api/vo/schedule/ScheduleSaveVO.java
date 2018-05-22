package com.jdy.b2b.api.vo.schedule;

import com.jdy.b2b.api.model.Schedule;
import com.jdy.b2b.api.model.diy.BusDTO;
import com.jdy.b2b.api.model.ticket.Ticket;

import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/19 17:12
 */
public class ScheduleSaveVO extends Schedule {

    /**
     * 出发时间列表（便于批量添加）:yyyy-MM-dd
     */
    private List<String> calendars;

    /**
     * 选中的票，含自定义选项
     */
    private List<Ticket> tickets;

    private List<BusDTO> busDTOS;

    public List<String> getCalendars() {
        return calendars;
    }

    public void setCalendars(List<String> calendars) {
        this.calendars = calendars;
    }

    public List<Ticket> getTickets() {
        return tickets;
    }

    public void setTickets(List<Ticket> tickets) {
        this.tickets = tickets;
    }

    public List<BusDTO> getBusDTOS() {
        return busDTOS;
    }

    public void setBusDTOS(List<BusDTO> busDTOS) {
        this.busDTOS = busDTOS;
    }
}
