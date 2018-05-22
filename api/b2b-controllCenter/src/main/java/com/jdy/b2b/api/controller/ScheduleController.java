package com.jdy.b2b.api.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.BaseController;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.TouristCancelVO;
import com.jdy.b2b.api.model.diy.*;
import com.jdy.b2b.api.model.scheduleplan.ScheduleTouristsDO;
import com.jdy.b2b.api.model.scheduleplan.ScheduleTouristsQueryDTO;
import com.jdy.b2b.api.service.OrderTouristService;
import com.jdy.b2b.api.service.ScheduleService;
import com.jdy.b2b.api.vo.schedule.ScheduleGuestQueryVO;
import com.jdy.b2b.api.vo.schedule.ScheduleSaveVO;
import com.jdy.b2b.api.vo.schedule.ScheduleUpdateVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/19 16:21
 */
@RestController
@RequestMapping("Schedule")
public class ScheduleController extends BaseController {

    @Autowired
    ScheduleService scheduleService;
    @Autowired
    OrderTouristService orderTouristService;

    /**
     * 班期列表搜索,根据传入的参数进行分组
     */
    @PostMapping("/list")
    public ResultBean selectScheduleList(@RequestBody ScheduleQuery scheduleQuery) {
        if (scheduleQuery.getCurrPage() != null && scheduleQuery.getPageSize() != null) {
            PageHelper.startPage(scheduleQuery.getCurrPage(), scheduleQuery.getPageSize());
        }
        List<ScheduleDTO> list = scheduleService.selectScheduleList(scheduleQuery);
        SimpleDateFormat calendarSdf = new SimpleDateFormat("yyyy/MM/dd");
        SimpleDateFormat timeSdf = new SimpleDateFormat("HH:mm:ss");
        //如果没有传flag,则将所有过期的班期 sStatus标为3
        Boolean b = Integer.valueOf(3).equals(scheduleQuery.getFlag());
        if (scheduleQuery.getFlag() == null || Integer.valueOf(3).equals(scheduleQuery.getFlag())) {
            if(list!=null &&list.size()>0){
                list.stream().forEach(s->{
                    try {
                        Date parse = calendarSdf.parse(calendarSdf.format(new Date()));
                        Date parse1 = timeSdf.parse(timeSdf.format(new Date()));
                        if(s.getId().equals(786)){
                            logger.error(s.getsCalendar().getTime()+"");
                            logger.error(parse.getTime()+"");
                            logger.error(""+s.getsLeaveTime().getTime());
                            logger.error(""+parse1.getTime());
                        }
                        if((s.getsCalendar().getTime()==parse.getTime() && s.getsLeaveTime().getTime()<parse1.getTime())||
                                s.getsCalendar().getTime()<parse.getTime()){
                            s.setsStatus(Integer.valueOf(3));
                        }
                    } catch (ParseException e) {
                        throw new RuntimeException("班期查询出错了!");
                    }
                });

            }
        }

        /*if (scheduleQuery.getOrderBy() != null) {
            PageHelper.orderBy(ScheduleListOrderEnum.getOrderByValue(scheduleQuery.getOrderBy()));
        }*/
        return ResultBean.getSuccessResult(new PageInfo<>(list));
    }

    /**
     * 查询指定班期，并返回相关票信息
     * //flag 1:集结 2:产品列表
     */
    @PostMapping("/scheduleWithTickets")
    public ResultBean selectScheduleWithTickets(@RequestBody ScheduleUpdateVO schedule) {
        ScheduleWithTicketsDTO dto = scheduleService.selectScheduleWithTickets(schedule.getId(),schedule.getFlag());
        return ResultBean.getSuccessResult(dto);
    }

    @PostMapping("/batchInsert")
    public ResultBean batchInsertSchedule(@RequestBody ScheduleSaveVO vo) throws ParseException {
        List<Long> list = scheduleService.batchSaveScheduleInfo(vo);
        ResultBean successResult = ResultBean.getSuccessResult();
        successResult.setId(list.toArray(new Long[]{}));
        return successResult;
    }

    @PostMapping("/updateSchedule")
    public ResultBean updateSchedule(@RequestBody ScheduleUpdateVO vo) {
        scheduleService.updateScheduleInfo(vo);
        return ResultBean.getSuccessResult();
    }

    @GetMapping("/clearCustomTickets/{id}")
    public ResultBean clearCustomScheduleTickets(@PathVariable Long id) {
        scheduleService.clearCustomScheduleTickets(id);
        return ResultBean.getSuccessResult();
    }

    /**
     * 查询班期的接送站点信息
     */
    @PostMapping("/departuresWithStops")
    public ResultBean selectDeparturesWithStops(@RequestBody ScheduleDepartsSearchVO vo) {
        ScheduleDeparturesDTO dto = new ScheduleDeparturesDTO();
        if (vo.getdType() == null || vo.getdType().equals(0)) {
            dto.setDepartures(scheduleService.selectDepartures(vo));
        }
        if (vo.getdType() == null || !vo.getdType().equals(0)) {
            dto.setDeparturesWithStops(scheduleService.selectDeparturesWithStops(vo));
        }
        return ResultBean.getSuccessResult(dto);
    }

    @PostMapping("/batchCancelTourist")
    public ResultBean batchCancelTourist(@RequestBody TouristCancelVO touristCancelVO){
        return orderTouristService.batchCancelTourist(touristCancelVO);
    }

    @GetMapping("/createSGroupOrderNo")
    public ResultBean createSGroupOrderNo(){
        scheduleService.createSGroupOrderNo();
        return ResultBean.getSuccessResult();
    }

    @PostMapping("guestList")
    public ResultBean guestList(@RequestBody ScheduleGuestQueryVO vo){
        if (vo.getCurrPage() != null && vo.getPageSize() != null) {
            PageHelper.startPage(vo.getCurrPage(), vo.getPageSize());
        }
        return ResultBean.getSuccessResult(new PageInfo<>(scheduleService.guestList(vo.getId())));
    }

    @RequestMapping("/queryTouristsListByScheduleId")
    @ResponseBody
    public ResultBean queryTouristsListByScheduleId(@RequestBody ScheduleTouristsQueryDTO dto) {
        List<ScheduleTouristsDO> list = scheduleService.queryTouristsListByScheduleId(dto);
        if(!Boolean.TRUE.equals(dto.getExport())) {
            PageInfo pageInfo = new PageInfo(list);
            return ResultBean.getSuccessResult(pageInfo);
        } else {
            PageInfo pageInfo = new PageInfo(list);
            return ResultBean.getSuccessResult(pageInfo);
        }
    }
}
