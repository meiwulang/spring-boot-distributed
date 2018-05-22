package com.jdy.b2b.api.dao.schedule;

import com.jdy.b2b.api.model.diy.OrderGroupConfirmation;
import com.jdy.b2b.api.model.diy.OrderTripDTO;
import com.jdy.b2b.api.model.schedule.ScheduleInfo;
import com.jdy.b2b.api.model.schedule.ScheduleSetting;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
@Mapper
public interface ScheduleSettingMapper {
    int deleteByPrimaryKey(Long id);

    int insert(ScheduleSetting record);

    int insertSelective(ScheduleSetting record);

    ScheduleSetting selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(ScheduleSetting record);

    int updateByPrimaryKey(ScheduleSetting record);


    List<ScheduleSetting> selectByScheduleId(Long scheduleId);

    /**
     * 理论上班期1对多团期，通过companyId起到限制作用，但现在数据都是1对1，companyId没有用
     * @param scheduleId
     * @param companyId
     * @return
     */
    ScheduleSetting selectByScheduleIdAndCompanyId(@Param("scheduleId") Long scheduleId,@Param("companyId") Long companyId);

    List<OrderTripDTO> selectTripsByProductId(Long id);

    int updateDepartureStatus(ScheduleSetting scheduleSetting);

    List<ScheduleSetting> selectAllStartedSchedule();

    ScheduleSetting selectByGroup_no(String group_no);
    OrderGroupConfirmation selectProductById(Long id);

    ScheduleInfo queryScheduleInfo(@Param("scheduleInfoId") Long scheduleInfoId,@Param("productCostingTitleId") Long productCostingTitleId, @Param("id") Long id);
}