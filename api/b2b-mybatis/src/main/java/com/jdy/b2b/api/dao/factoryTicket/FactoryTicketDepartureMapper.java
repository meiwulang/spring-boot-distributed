package com.jdy.b2b.api.dao.factoryTicket;

import com.jdy.b2b.api.model.factoryTicket.FactoryTicketDeparture;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface FactoryTicketDepartureMapper {
    int deleteByPrimaryKey(Long id);

    int insert(FactoryTicketDeparture record);

    int insertSelective(FactoryTicketDeparture record);

    FactoryTicketDeparture selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(FactoryTicketDeparture record);

    int updateByPrimaryKey(FactoryTicketDeparture record);

    int bathInsert(@Param("ticketId") Long ticketId,@Param("departureIds") List<Long> departureIds);

    int bathDelete(Long ticketId);

    List<Long> selectDepartureIdsByTicketId(Long ticketId);

    List<String> selectDepartureNamesByTicketId(Long ticketId);
}