package com.jdy.b2b.web.service;

import com.jdy.b2b.web.pojo.label.LabelDTO;
import com.jdy.b2b.web.pojo.schedule.TicketDTO;
import com.jdy.b2b.web.pojo.ticket.Ticket;
import com.jdy.b2b.web.pojo.ticket.TicketDefaultVo;
import com.jdy.b2b.web.pojo.ticket.TicketQueryVo;
import com.jdy.b2b.web.pojo.ticket.TicketSaveOrUpdateVo;
import com.jdy.b2b.web.util.ResultBean;

import java.util.List;

/**
 * Created by yangcheng on 2017/7/4.
 */
public interface TicketService {
    ResultBean queryForTicketListForPage(TicketQueryVo vo);

    ResultBean queryForOutTicketList(TicketQueryVo vo);

    ResultBean<Ticket> queryForTicketById(Long id,Integer single);

    ResultBean<Long> saveTicketBash(List<TicketSaveOrUpdateVo> list);

    ResultBean<Long> saveOrUpdateTicket(TicketSaveOrUpdateVo vo);

    ResultBean<Long> updateTicketOnly(TicketDefaultVo vo);
}
