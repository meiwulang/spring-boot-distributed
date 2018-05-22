package com.jdy.b2b.api.dao.ticketset;

import com.jdy.b2b.api.model.ticketset.TicketSet;
import com.jdy.b2b.api.model.ticketset.TicketSetVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface TicketSetMapper {
    int deleteByPrimaryKey(Long id);

    int insert(TicketSet record);

    int insertSelective(TicketSet record);

    TicketSet selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(TicketSet record);

    int updateByPrimaryKey(TicketSet record);

    int saveTicketSetBash(List<TicketSet> list);

    int deleteSetById(Long id);

    List<TicketSet> selectListSelectiveByIds(TicketSetVO vo);
}