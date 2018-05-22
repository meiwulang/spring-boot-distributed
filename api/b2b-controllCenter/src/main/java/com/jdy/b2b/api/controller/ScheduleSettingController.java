package com.jdy.b2b.api.controller;

import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.orderTouristConfirm.ConfirmTouristParam;
import com.jdy.b2b.api.model.orderTouristConfirm.OrderTouristConfirm;
import com.jdy.b2b.api.model.orderTouristConfirm.OrderTouristConfirmListParam;
import com.jdy.b2b.api.model.schedule.ScheduleSetting;
import com.jdy.b2b.api.model.schedule.ScheduleSettingDto;
import com.jdy.b2b.api.model.scheduleplan.ScheduleManagerDO;
import com.jdy.b2b.api.model.scheduleplan.ScheduleManagerQueryDTO;
import com.jdy.b2b.api.model.scheduleplan.ScheduleTouristsDO;
import com.jdy.b2b.api.service.OrderTouristConfirmService;
import com.jdy.b2b.api.service.ScheduleService;
import com.jdy.b2b.api.service.ScheduleSettingService;
import org.apache.commons.lang3.ArrayUtils;
import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Objects;

/**
 * Created by dugq on 2018/1/30.
 */
@RestController
@RequestMapping("Schedule")
public class ScheduleSettingController {
    @Autowired
    private ScheduleSettingService scheduleSettingService;
    @Autowired
    private ScheduleService scheduleService;
    @Autowired
    private OrderTouristConfirmService orderTouristConfirmService;


    @RequestMapping("updateScheduleSetting")
    public ResultBean updateScheduleSetting(@RequestBody ScheduleSettingDto scheduleSettingDto){
        scheduleSettingService.updateScheduleSetting(scheduleSettingDto);
        return ResultBean.getSuccessResult();
    }

    @RequestMapping("getScheduleSetting/{scheduleSettingId}")
    public ResultBean getScheduleSetting(@PathVariable("scheduleSettingId") Long scheduleSettingId){
        ScheduleSettingDto scheduleSetting = scheduleSettingService.selectScheduleSetting(scheduleSettingId);
        return ResultBean.getSuccessResult(scheduleSetting);
    }

    @PostMapping("updateScheduleStartStatus")
    public ResultBean updateScheduleStartStatus(@RequestBody ScheduleSetting scheduleSetting){
        scheduleSettingService.updateDepartureStatus(scheduleSetting);
        return ResultBean.getSuccessResult();
    }

    @RequestMapping("/queryScheduleManagerList")
    @ResponseBody
    public ResultBean queryScheduleManagerList(@RequestBody ScheduleManagerQueryDTO scheduleManagerQueryDTO) {
        List<ScheduleManagerDO> scheduleManagerDOList = scheduleService.queryScheduleManagerList(scheduleManagerQueryDTO);
        PageInfo pageInfo = new PageInfo(scheduleManagerDOList);
        return ResultBean.getSuccessResult(pageInfo);
    }

    @RequestMapping("/confirmTouristList")
    @ResponseBody
    public ResultBean confirmTouristList(@RequestBody OrderTouristConfirmListParam dto) {
        List<ScheduleTouristsDO> result = null;
        //全部
        if(ArrayUtils.isEmpty(dto.getStatus()) || ArrayUtils.contains(dto.getStatus(),-1) || ArrayUtils.contains(dto.getStatus(),0)){
            result =  orderTouristConfirmService.selectTouristListByScheduleSettingId(dto);
        }else {
            result = orderTouristConfirmService.selectConfirmTouristListByScheduleSettingId(dto);
        }
        if(Objects.equals(Boolean.TRUE,dto.getExport())) {
            return ResultBean.getSuccessResult(result);
        } else {
            PageInfo pageInfo = new PageInfo(result);
            return ResultBean.getSuccessResult(pageInfo);
        }
    }

    @RequestMapping("/confirmTourists")
    public ResultBean confirmTourists(@RequestBody @NotEmpty List<ConfirmTouristParam> param) throws Exception {
        orderTouristConfirmService.confirmTourists(param);
        return ResultBean.getSuccessResult();
    }

    @RequestMapping("/confirmScheduleSetting/{scheduleSettingId}")
    public ResultBean confirmScheduleSetting(@PathVariable Long scheduleSettingId) throws Exception {
        ScheduleSetting scheduleSetting = scheduleSettingService.selectByPrimaryKey(scheduleSettingId);
        if(Objects.isNull(scheduleSetting)){
            return ResultBean.getErrorResult("团期不存在");
        }
        if(orderTouristConfirmService.hasTouristNotConfirmed(scheduleSetting.getScheduleId())){
            return ResultBean.getErrorResult("还有游客未确认~");
        }
        scheduleSetting.setDepartureStatus((byte) 0);
        scheduleSetting.setId(scheduleSettingId);
        scheduleSetting.setConfirmTime(new Date());
        scheduleSettingService.updateDepartureStatus(scheduleSetting);
        return ResultBean.getSuccessResult();
    }

    @RequestMapping("/getConfirmTime/{scheduleSettingId}")
    public ResultBean getConfirmTime(@PathVariable Long scheduleSettingId) {
        ScheduleSetting scheduleSetting = scheduleSettingService.selectByPrimaryKey(scheduleSettingId);
        if(Objects.isNull(scheduleSetting)){
            return ResultBean.getErrorResult("no such scheduleSetting");
        }
        return ResultBean.getSuccessResult(scheduleSetting.getConfirmTime());
    }
}
