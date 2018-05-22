package com.jdy.b2b.api.dao.orderTouristConfirm;

import com.jdy.b2b.api.model.orderTouristConfirm.OrderTouristConfirm;
import com.jdy.b2b.api.model.orderTouristConfirm.OrderTouristConfirmListParam;
import com.jdy.b2b.api.model.scheduleplan.ScheduleTouristsDO;
import com.jdy.b2b.api.model.scheduleplan.ScheduleTouristsQueryDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface OrderTouristConfirmMapper {
    int deleteByPrimaryKey(Long id);

    int insert(OrderTouristConfirm record);

    int insertSelective(OrderTouristConfirm record);

    OrderTouristConfirm selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(OrderTouristConfirm record);

    int updateByPrimaryKey(OrderTouristConfirm record);

    List<ScheduleTouristsDO> selectConfirmTouristListByScheduleSettingId(OrderTouristConfirmListParam dto);

    List<ScheduleTouristsDO> selectTouristListByScheduleSettingId(OrderTouristConfirmListParam dto);

    Boolean hasAllTouristConfirmed(Long scheduleSettingId);

    OrderTouristConfirm selectByTouristId(Long orderTouristId);
}