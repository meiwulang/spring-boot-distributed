package com.jdy.b2b.api.controller;

import com.alibaba.fastjson.JSONArray;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.reports.AgentDevelopChartDO;
import com.jdy.b2b.api.model.reports.AgentDevelopChartQueryVo;
import com.jdy.b2b.api.service.AgentDevelopChartService;
import com.jdy.b2b.api.vo.AgentDevelopChartResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * Created by yangcheng on 2017/11/10.
 */
@RestController
@RequestMapping("agentDistChart")
public class AgentDevelopChartController {

    @Autowired
    private AgentDevelopChartService agentDevelopChartService;

    private Logger logger = LoggerFactory.getLogger(this.getClass());


    @PostMapping("agentChart")
    public ResultBean getAgentChart(@RequestBody AgentDevelopChartQueryVo vo) throws ParseException {
        List<String> dateStrList = new ArrayList<>();//横坐标
        List<Integer> todayAgentList = new ArrayList<>();//日增长
        List<Integer> allAgentList = new ArrayList<>();//累计
        Collection<AgentDevelopChartDO> increaseList;
        Integer beforePeopleNum;
        if (vo.getUserId() == null){// 非 用户级
            increaseList = agentDevelopChartService.getAgentCount(vo);
            beforePeopleNum = agentDevelopChartService.getBeforePeopleNum(vo);
        }else{ // 用户级 或者是更高级查看 某个销售经理的数据
            increaseList = agentDevelopChartService.getUserLevelCount(vo);
            beforePeopleNum = agentDevelopChartService.getUserLevelBeforePeopleNum(vo);
        }
        logger.info("increaseList-----------> " + JSONArray.toJSONString(increaseList));
        logger.info("beforePeopleNum-----------> " + beforePeopleNum);
        if (increaseList != null && increaseList.size() > 0){
            if (beforePeopleNum == null){
                beforePeopleNum = 0;
            }

            for (AgentDevelopChartDO chartDO : increaseList){
                dateStrList.add(chartDO.getStringDay());
                todayAgentList.add(chartDO.getTodayCount());
                beforePeopleNum += chartDO.getTodayCount();
                allAgentList.add(beforePeopleNum);
            }
        }

        AgentDevelopChartResult agentResult = new AgentDevelopChartResult();
        agentResult.setDateStringList(dateStrList);
        agentResult.setTodayAgentList(todayAgentList);
        agentResult.setAllAgentList(allAgentList);

        return ResultBean.getIndexSuccessResult(agentResult);
    }

    //手动同步订单数据到销售统计表中
    @GetMapping("syncOrderData/{dateStr}")
    public ResultBean<Integer> syncOrderData(@PathVariable String dateStr){
        return ResultBean.getSuccessResult(agentDevelopChartService.syncOrderData(dateStr));
    }

}
