package com.jdy.b2b.api.service;

import com.jdy.b2b.api.model.factoryTicket.FactoryTicket;

import java.util.List;

/**
 * Created by dugq on 2018/4/10.
 */
public interface FactoryTicketService {
    int insertFactoryTicket(FactoryTicket factoryTicket);
    int updateFactoryTicket(FactoryTicket factoryTicket);
    List<FactoryTicket> selectFactoryTicketList(FactoryTicket factoryTicket);
    int delete(Long id);

    FactoryTicket selectByPrimaryKey(Long id);
}
