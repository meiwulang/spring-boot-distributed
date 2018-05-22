package com.jdy.b2b.api.dao.schedule;

import com.jdy.b2b.api.model.schedule.ScheduleFlight;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ScheduleFlightMapper {
    int deleteByPrimaryKey(Long id);

    int insert(ScheduleFlight record);

    int insertSelective(ScheduleFlight record);

    ScheduleFlight selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(ScheduleFlight record);

    int updateByPrimaryKey(ScheduleFlight record);

    List<ScheduleFlight> selectByScheduleSettingId(Long id);

    int deleteByScheduleSettingId(Long id);
}