package com.jdy.b2b.api.dao;

import com.jdy.b2b.api.model.ScheduleTicket;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ScheduleTicketMapper {
    int deleteByPrimaryKey(Long id);

    int insert(ScheduleTicket record);

    int insertSelective(ScheduleTicket record);

    ScheduleTicket selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(ScheduleTicket record);

    int updateByPrimaryKey(ScheduleTicket record);

    List<ScheduleTicket> selectOldScheduleTicektList(List<Long> list);

    int insertBash(List<ScheduleTicket> scheduleTicketList);

    List<Long> selectEffectScheduleIdList(List<Long> idList);
}