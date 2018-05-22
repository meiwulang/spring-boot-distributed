package com.jdy.b2b.api.dao.ticketarea;

import com.jdy.b2b.api.model.ticketarea.TicketArea;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface TicketAreaMapper {
    int deleteByPrimaryKey(Long id);

    int insert(TicketArea record);

    int insertSelective(TicketArea record);

    TicketArea selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(TicketArea record);

    int updateByPrimaryKey(TicketArea record);

    int saveTicketAreaBash(List<TicketArea> ticketAreaList);

    int deleteByTicketId(Long ticketId);
}