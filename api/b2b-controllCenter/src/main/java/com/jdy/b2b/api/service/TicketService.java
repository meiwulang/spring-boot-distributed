package com.jdy.b2b.api.service;


import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.ticket.Ticket;
import com.jdy.b2b.api.model.ticket.TicketListDO;
import com.jdy.b2b.api.model.ticket.TicketSingleResult;
import com.jdy.b2b.api.model.ticketarea.TicketArea;
import com.jdy.b2b.api.model.ticketdeparture.TicketDeparture;
import com.jdy.b2b.api.model.ticketset.TicketSet;
import com.jdy.b2b.api.vo.ticket.CopyGatherTicketsVO;
import com.jdy.b2b.api.vo.ticket.TicketSaveOrUpdateVo;

import java.util.List;

/**
 * Created by yangcheng on 2017/7/3.
 */
public interface TicketService {
    List<TicketSingleResult> queryForOutTicketList(Ticket ticket);

    int updateTicket(Ticket ticket);

    int saveTicket(Ticket ticket);

    int saveTicketBash(List<Ticket> ticketList);

    Ticket queryForTicketById(Long id,Integer single);

    int saveTicketSetBash(List<TicketSet> sets);

    int saveTicketAreaBash(List<TicketArea> ticketAreaList);

    int saveTicketDepartureBash(List<TicketDeparture> ticketDepartureList);

    int deleteSetById(Long id);

    int deleteAreaByTicketId(Long id);

    int deleteDepartureByTicketId(Long id);

    Ticket queryForTicketOnly(Long id);

    Long queryDefaultPrice(Long id);

    List<Ticket> getTicketList(Long productId);

    List<TicketListDO> queryForTicketListForPage(Ticket ticket);

    int copyGatherTickets(List<Long> ids,CopyGatherTicketsVO vo);

    int createAndCopyTicket(TicketSaveOrUpdateVo vo,Ticket ticket);

    int deleteByFromTicketId(Long id);

    void synchroGatherTickets(Ticket ticket,TicketSaveOrUpdateVo vo);
}
