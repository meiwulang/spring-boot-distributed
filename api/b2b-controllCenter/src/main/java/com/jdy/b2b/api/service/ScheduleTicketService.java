package com.jdy.b2b.api.service;

import com.jdy.b2b.api.model.Schedule;
import com.jdy.b2b.api.model.ScheduleTicket;
import com.jdy.b2b.api.model.diy.TicketDTO;
import com.jdy.b2b.api.model.ticket.Ticket;

import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/19 10:19
 */
public interface ScheduleTicketService {

    List<TicketDTO> selectTicketListUnionAll(ScheduleTicket rec,Integer flag);

    void saveScheduleTicketInfo(List<Schedule> schedules, List<Ticket> tickets);

    void clearCustomScheduleTickets(Long id);
}
