package com.jdy.b2b.api.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.dao.factoryTicket.FactoryTicketDepartureMapper;
import com.jdy.b2b.api.dao.factoryTicket.FactoryTicketMapper;
import com.jdy.b2b.api.dao.factoryTicket.TicketFactoryTicketMapper;
import com.jdy.b2b.api.model.factoryTicket.FactoryTicket;
import com.jdy.b2b.api.service.FactoryTicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

/**
 * Created by dugq on 2018/4/10.
 */
@Service
public class FactoryTicketServiceImpl implements FactoryTicketService {
    @Autowired
    private FactoryTicketMapper factoryTicketMapper;
    @Autowired
    private FactoryTicketDepartureMapper factoryTicketDepartureMapper;


    @Override
    public int insertFactoryTicket(FactoryTicket factoryTicket) {
        int result = factoryTicketMapper.insertSelective(factoryTicket);
        factoryTicketDepartureMapper.bathInsert(factoryTicket.getId(),factoryTicket.getDepartureIds());
        return result;
    }

    @Override
    public int updateFactoryTicket(FactoryTicket factoryTicket) {
        factoryTicketDepartureMapper.bathDelete(factoryTicket.getId());
        factoryTicket.setTicketStatus((byte) 2);
        int result = factoryTicketMapper.updateByPrimaryKeySelective(factoryTicket);
        factoryTicketDepartureMapper.bathInsert(factoryTicket.getId(),factoryTicket.getDepartureIds());
        return result;
    }

    @Override
    public List<FactoryTicket> selectFactoryTicketList(FactoryTicket factoryTicket) {
        if (Objects.nonNull(factoryTicket.getPageIndex())){
            PageHelper.startPage(factoryTicket.getPageIndex(),20);
        }
        return  factoryTicketMapper.selectList(factoryTicket);
    }

    @Override
    public int delete(Long id) {
        FactoryTicket factoryTicket = factoryTicketMapper.selectByPrimaryKey(id);
        factoryTicket.setTicketStatus((byte) 0);
        return factoryTicketMapper.updateByPrimaryKeySelective(factoryTicket);
    }

    @Override
    public FactoryTicket selectByPrimaryKey(Long id) {
        return factoryTicketMapper.selectByPrimaryKey(id);
    }
}
