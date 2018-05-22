package com.jdy.b2b.web.service;

import com.jdy.b2b.web.pojo.factoryTicket.FactoryTicket;
import com.jdy.b2b.web.util.ResultBean;

/**
 * Created by dugq on 2018/4/11.
 */
public interface FactoryTicketService {
    ResultBean insertFactoryTicket(FactoryTicket factoryTicket);

    ResultBean updateFactoryTicket(FactoryTicket factoryTicket);

    ResultBean selectFactoryTicketList(FactoryTicket factoryTicket);

    ResultBean get(Long id);

    ResultBean delete(Long id);
}
