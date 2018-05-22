package com.jdy.b2b.api.service;

import com.jdy.b2b.api.model.Schedule;
import com.jdy.b2b.api.model.schedule.ScheduleSetting;
import com.jdy.b2b.api.model.schedule.ScheduleSettingDto;

import java.util.List;

/**
 * Created by dugq on 2018/1/30.
 */
public interface ScheduleSettingService {
    int deleteByPrimaryKey(Long id);

    int insert(ScheduleSetting record);

    int insertSelective(ScheduleSetting record);

    ScheduleSetting selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(ScheduleSetting record);

    int updateByPrimaryKey(ScheduleSetting record);

    int updateScheduleSetting(ScheduleSettingDto scheduleSettingDto);

    ScheduleSettingDto selectScheduleSetting(Long scheduleSettingId);

    List<ScheduleSetting> createNewScheduleSettingBySchedules(List<Schedule> schedules);

    //for 集结产品
    List<ScheduleSetting> createNewScheduleSettingByProductIdAndCompanyId(Long productId,Long companyId);

    ScheduleSetting createNewScheduleSettingByScheduleIdAndCompanyId(Long scheduleId, Long companyId);

    int updateDepartureStatus(ScheduleSetting scheduleSetting);

    int findReturnSchedulesAndModify();

    int createNewScheduleOnAssemblyProduct(List<Schedule> schedules,long productId);
}
