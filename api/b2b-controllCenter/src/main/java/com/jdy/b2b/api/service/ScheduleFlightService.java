package com.jdy.b2b.api.service;

import com.jdy.b2b.api.model.schedule.ScheduleFlight;
import com.jdy.b2b.api.model.schedule.ScheduleSettingDto;

/**
 * Created by dugq on 2018/1/30.
 */
public interface ScheduleFlightService {
    int deleteByPrimaryKey(Long id);

    int insert(ScheduleFlight record);

    int insertSelective(ScheduleFlight record);

    ScheduleFlight selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(ScheduleFlight record);

    int updateByPrimaryKey(ScheduleFlight record);

}
