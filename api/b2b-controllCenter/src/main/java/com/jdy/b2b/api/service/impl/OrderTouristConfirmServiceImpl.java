package com.jdy.b2b.api.service.impl;

import com.alibaba.fastjson.JSON;
import com.github.pagehelper.PageHelper;
import com.jdy.b2b.api.dao.OrderTouristMapper;
import com.jdy.b2b.api.dao.orderTouristConfirm.OrderTouristConfirmMapper;
import com.jdy.b2b.api.dao.schedule.ScheduleSettingMapper;
import com.jdy.b2b.api.model.OrderTourist;
import com.jdy.b2b.api.model.orderRefund.OrderConfirm;
import com.jdy.b2b.api.model.orderTouristConfirm.ConfirmTouristParam;
import com.jdy.b2b.api.model.orderTouristConfirm.OrderTouristConfirm;
import com.jdy.b2b.api.model.orderTouristConfirm.OrderTouristConfirmListParam;
import com.jdy.b2b.api.model.schedule.ScheduleSetting;
import com.jdy.b2b.api.model.scheduleplan.ScheduleTouristsDO;
import com.jdy.b2b.api.model.scheduleplan.ScheduleTouristsQueryDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

/**
 * Created by dugq on 2018/5/11.
 */
@Service
public class OrderTouristConfirmServiceImpl implements com.jdy.b2b.api.service.OrderTouristConfirmService {

    @Autowired
    OrderTouristConfirmMapper orderTouristConfirmMapper;
    @Autowired
    OrderTouristMapper orderTouristMapper;
    @Autowired
    ScheduleSettingMapper scheduleSettingMapper;

    @Override
    public int deleteByPrimaryKey(Long id) {
        return orderTouristConfirmMapper.deleteByPrimaryKey(id);
    }

    @Override
    public int insert(OrderTouristConfirm record) {
        return orderTouristConfirmMapper.insert(record);
    }

    @Override
    public int insertSelective(OrderTouristConfirm record) {
        return orderTouristConfirmMapper.insertSelective(record);
    }

    @Override
    public OrderTouristConfirm selectByPrimaryKey(Long id) {
        return orderTouristConfirmMapper.selectByPrimaryKey(id);
    }

    @Override
    public int updateByPrimaryKeySelective(OrderTouristConfirm record) {
        return orderTouristConfirmMapper.updateByPrimaryKeySelective(record);
    }

    @Override
    public int updateByPrimaryKey(OrderTouristConfirm record) {
        return orderTouristConfirmMapper.updateByPrimaryKey(record);
    }

    @Override
    public List<ScheduleTouristsDO> selectTouristListByScheduleSettingId(OrderTouristConfirmListParam dto) {
        if(!Boolean.TRUE.equals(dto.getExport())) {
            if (dto.getCurrPage() == null || dto.getCurrPage() == 0) {
                dto.setCurrPage(1);
            }
            PageHelper.startPage(dto.getCurrPage(), dto.getPageSize());
        }
        return orderTouristConfirmMapper.selectTouristListByScheduleSettingId(dto);
    }


    @Override
    public List<ScheduleTouristsDO> selectConfirmTouristListByScheduleSettingId(OrderTouristConfirmListParam dto) {
        if(!Boolean.TRUE.equals(dto.getExport())) {
            if (dto.getCurrPage() == null || dto.getCurrPage() == 0) {
                dto.setCurrPage(1);
            }
            PageHelper.startPage(dto.getCurrPage(), dto.getPageSize());
        }
        return orderTouristConfirmMapper.selectConfirmTouristListByScheduleSettingId(dto);
    }

    @Override
    public int confirmTourists(List<ConfirmTouristParam> param) {
        param.forEach(orderTouristParam->{
            OrderTourist orderTourist = orderTouristMapper.selectByPrimaryKey(orderTouristParam.getTouristId());
            if(Objects.isNull(orderTourist)){
                throw new RuntimeException("not such tourist");
            }
            OrderTouristConfirm orderTouristConfirm = orderTouristConfirmMapper.selectByTouristId(orderTourist.getId());
            if(Objects.isNull(orderTouristConfirm)){
                orderTouristConfirm  = JSON.parseObject(JSON.toJSONString(orderTourist),OrderTouristConfirm.class);
                orderTouristConfirm.setTouristId(orderTouristConfirm.getId());
                orderTouristConfirm.setId(null);
                orderTouristConfirm.setOtExtStatus(orderTouristParam.getStatus());
                orderTouristConfirmMapper.insertSelective(orderTouristConfirm);
                return;
            }else{
                orderTouristConfirm.setOtExtStatus(orderTouristParam.getStatus());
                orderTouristConfirmMapper.updateByPrimaryKeySelective(orderTouristConfirm);
            }
        });
        return param.size();
    }

    @Override
    public Boolean hasTouristNotConfirmed(Long scheduleId) {
        return orderTouristConfirmMapper.hasAllTouristConfirmed(scheduleId);
    }
}
