package com.jdy.b2b.api.controller;

import com.jdy.b2b.api.common.BaseController;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.alterTicket.OrderAlterTicketRecord;
import com.jdy.b2b.api.model.alterTicket.OrderAlterVo;
import com.jdy.b2b.api.model.alterTicket.OrderAlterTicketWithTouristDTO;
import com.jdy.b2b.api.model.alterTicket.OrderQueryScheduleByTicketVO;
import com.jdy.b2b.api.service.OrderAlterTicketService;
import com.jdy.b2b.api.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * Created by strict on 2018/4/20.
 */
@RestController
@RequestMapping("/alterTicket")
public class OrderAlterTicketController extends BaseController {
    @Autowired
    private OrderAlterTicketService orderAlterTicketService;
    @Autowired
    private ScheduleService scheduleService;

    /**
     * 改签记录列表
     *
     * @param vo
     * @return
     */
    @PostMapping("/alterTicketList")
    public ResultBean alterTicketList(@RequestBody OrderAlterTicketRecord vo) {
        return orderAlterTicketService.getAlterTicketList(vo);
    }

    @PostMapping("/changeTicket")
    public ResultBean changeTicket(@RequestBody OrderAlterVo vo) {
        return orderAlterTicketService.changeTicket(vo);
    }

    /**
     * 在审核改签记录前获取改签记录信息
     * @return
     */
    @GetMapping("/beforeAlterTicketRecord/{alterId}")
    public ResultBean getAlterTicketRecord(@PathVariable("alterId") Long alterId){

        return  orderAlterTicketService.getAlterTicketRecord(alterId);
    }

    /**
     * 申请改签请求
     * @return
     */
    @PostMapping("/applyAlterTicketRecord")
    public ResultBean applyAlterTicketRecord(@RequestBody OrderAlterTicketWithTouristDTO vo){
        return orderAlterTicketService.applyAlterTicketRecord(vo);
    }

    /**
     * 根据所选票获取当前时间之后
     * @param vo
     * @return
     */
    @PostMapping("/getScheduleListByTicket")
    public ResultBean getScheduleListByTicket(@RequestBody OrderQueryScheduleByTicketVO vo){

        return scheduleService.getScheduleListByTicket(vo);
    }


}
