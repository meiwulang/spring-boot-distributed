package com.jdy.b2b.web.controll.alterTicket;

import com.jdy.b2b.web.pojo.alterTicket.OrderAlterTicketRecord;
import com.jdy.b2b.web.pojo.alterTicket.OrderAlterTicketWithTouristDTO;
import com.jdy.b2b.web.pojo.alterTicket.OrderAlterVo;
import com.jdy.b2b.web.pojo.alterTicket.OrderQueryScheduleByTicketVO;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;
import io.swagger.annotations.Api;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * Created by strict on 2018/4/23.
 */
@Api(value = "alterTicket", description = "改签")
@RestController
@RequestMapping("/alterTicket")
public class OrderAlterTicketController extends BaseController{

    @PostMapping("/alterTicketList")
    public ResultBean alterTicketList(@RequestBody OrderAlterTicketRecord vo){
        return restTemplate.postForObject(salesCenterUrl+"/alterTicket/alterTicketList",vo,ResultBean.class);
    }

    /**
     * 在审核改签记录前获取改签记录信息
     * @return
     */
    @GetMapping("/beforeAlterTicketRecord/{alterId}")
    public ResultBean getAlterTicketRecord(@PathVariable("alterId") Long alterId){

        return restTemplate.getForObject(salesCenterUrl+"/alterTicket/beforeAlterTicketRecord/"+alterId,ResultBean.class);
    }

    /**
     * 确认改签
     * @param vo
     * @return
     */
    @PostMapping("/changeTicket")
    public ResultBean changeTicket(@Validated @RequestBody OrderAlterVo vo) {
        return restTemplate.postForObject(salesCenterUrl+"/alterTicket/changeTicket",vo,ResultBean.class);
    }

    /**
     * 根据所选票获取当前时间之后的可用班期列表
     * @param vo
     * @return
     */
    @PostMapping("/getScheduleListByTicket")
    public ResultBean getScheduleListByTicket(@RequestBody OrderQueryScheduleByTicketVO vo){

        return restTemplate.postForObject(salesCenterUrl+"/alterTicket/getScheduleListByTicket",vo,ResultBean.class);
    }

    /**
     * 申请改签请求
     * @return
     */
    @PostMapping("/applyAlterTicketRecord")
    public ResultBean applyAlterTicketRecord(@RequestBody OrderAlterTicketWithTouristDTO vo){
        return restTemplate.postForObject(salesCenterUrl+"/alterTicket/applyAlterTicketRecord",vo,ResultBean.class);
    }
}
