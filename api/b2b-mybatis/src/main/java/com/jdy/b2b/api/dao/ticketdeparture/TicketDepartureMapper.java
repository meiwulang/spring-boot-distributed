package com.jdy.b2b.api.dao.ticketdeparture;

import com.jdy.b2b.api.model.station.Departure;
import com.jdy.b2b.api.model.ticketdeparture.TicketDeparture;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface TicketDepartureMapper {
    int deleteByPrimaryKey(Long id);

    int insert(TicketDeparture record);

    int insertSelective(TicketDeparture record);

    TicketDeparture selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(TicketDeparture record);

    int updateByPrimaryKey(TicketDeparture record);

    int saveTicketDepartureBash(List<TicketDeparture> ticketDepartureList);

    int deleteDepartureByTicketId(Long id);

    Departure queryDepartureByName(String d);

    List<TicketDeparture> selectOldTicketDepartureList(List<Long> idList);

}