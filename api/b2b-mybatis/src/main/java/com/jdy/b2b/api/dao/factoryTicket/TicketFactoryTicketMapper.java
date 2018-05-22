package com.jdy.b2b.api.dao.factoryTicket;

import com.jdy.b2b.api.model.factoryTicket.TicketFactoryTicket;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TicketFactoryTicketMapper {
    int deleteByPrimaryKey(Long id);

    int insert(TicketFactoryTicket record);

    int insertSelective(TicketFactoryTicket record);

    TicketFactoryTicket selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(TicketFactoryTicket record);

    int updateByPrimaryKey(TicketFactoryTicket record);

    int bathInsert(@Param("ticketId") Long ticketId, @Param("factoryTicketIds") List<Long> factoryTicketIds);

    List<Long> selectFactoryTicketIds(Long ticketId);

    int bathDelete(Long ticketId);
}