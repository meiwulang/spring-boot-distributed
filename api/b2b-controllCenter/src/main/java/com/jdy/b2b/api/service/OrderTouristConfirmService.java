package com.jdy.b2b.api.service;

import com.jdy.b2b.api.model.orderTouristConfirm.ConfirmTouristParam;
import com.jdy.b2b.api.model.orderTouristConfirm.OrderTouristConfirm;
import com.jdy.b2b.api.model.orderTouristConfirm.OrderTouristConfirmListParam;
import com.jdy.b2b.api.model.scheduleplan.ScheduleTouristsDO;
import com.jdy.b2b.api.model.scheduleplan.ScheduleTouristsQueryDTO;

import java.util.List;

/**
 * Created by dugq on 2018/5/11.
 */
public interface OrderTouristConfirmService {
    int deleteByPrimaryKey(Long id);

    int insert(OrderTouristConfirm record);

    int insertSelective(OrderTouristConfirm record);

    OrderTouristConfirm selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(OrderTouristConfirm record);

    int updateByPrimaryKey(OrderTouristConfirm record);

    List<ScheduleTouristsDO> selectTouristListByScheduleSettingId(OrderTouristConfirmListParam param);

    List<ScheduleTouristsDO> selectConfirmTouristListByScheduleSettingId(OrderTouristConfirmListParam param);

    int confirmTourists(List<ConfirmTouristParam> param);

    Boolean hasTouristNotConfirmed(Long scheduleId);
}
