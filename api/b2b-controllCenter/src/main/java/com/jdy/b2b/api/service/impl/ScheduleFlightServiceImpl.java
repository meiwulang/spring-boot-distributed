package com.jdy.b2b.api.service.impl;

import com.jdy.b2b.api.dao.schedule.ScheduleFlightMapper;
import com.jdy.b2b.api.model.schedule.ScheduleFlight;
import com.jdy.b2b.api.model.schedule.ScheduleSettingDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

/**
 * Created by dugq on 2018/1/30.
 */
@Service
public class ScheduleFlightServiceImpl implements com.jdy.b2b.api.service.ScheduleFlightService {
    @Autowired
    private ScheduleFlightMapper scheduleFlightMapper;

    @Override
    public int deleteByPrimaryKey(Long id) {
        return scheduleFlightMapper.deleteByPrimaryKey(id);
    }

    @Override
    public int insert(ScheduleFlight record) {
        return scheduleFlightMapper.insert(record);
    }

    @Override
    public int insertSelective(ScheduleFlight record) {
        return scheduleFlightMapper.insertSelective(record);
    }

    @Override
    public ScheduleFlight selectByPrimaryKey(Long id) {
        return scheduleFlightMapper.selectByPrimaryKey(id);
    }

    @Override
    public int updateByPrimaryKeySelective(ScheduleFlight record) {
        return scheduleFlightMapper.updateByPrimaryKeySelective(record);
    }

    @Override
    public int updateByPrimaryKey(ScheduleFlight record) {
        return scheduleFlightMapper.updateByPrimaryKey(record);
    }

}
