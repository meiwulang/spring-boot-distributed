package com.jdy.b2b.api.service.Impl;

import com.alibaba.fastjson.JSONArray;
import com.jdy.b2b.api.dao.reports.AgentDevelopChartMapper;
import com.jdy.b2b.api.dao.user.UserMapper;
import com.jdy.b2b.api.model.reports.AgentDevelopChartDO;
import com.jdy.b2b.api.model.reports.AgentDevelopChartQueryVo;
import com.jdy.b2b.api.service.AgentDevelopChartService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Created by yangcheng on 2017/11/10.
 */
@Service
public class AgentDevelopChartServiceImpl implements AgentDevelopChartService {
    @Autowired
    private AgentDevelopChartMapper agentDevelopChartMapper;
    @Autowired
    private UserMapper userMapper;

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Override
    public List<AgentDevelopChartDO> getAgentCount(AgentDevelopChartQueryVo param) {

        return agentDevelopChartMapper.getAgentCount(param);
    }

    @Override
    public Integer getBeforePeopleNum(AgentDevelopChartQueryVo param) {
        return agentDevelopChartMapper.getBeforePeopleNum(param);
    }

    @Override
    @Transactional
    public int syncOrderData(String dateStr) {
        //删掉之前的统计数据
        int result = agentDevelopChartMapper.deleteFailedData(dateStr);

        return agentDevelopChartMapper.syncOrderData(dateStr);
    }

    @Override
    public Collection<AgentDevelopChartDO> getUserLevelCount(AgentDevelopChartQueryVo param) {
        List<AgentDevelopChartDO> orginList = agentDevelopChartMapper.getUserLevelAgentCount(param);
        logger.info(">>>>>>>>>>用户级 orginList<<<<<<<<<<"+JSONArray.toJSONString(orginList));
        Map<String,AgentDevelopChartDO> tempMap = orginList.stream().collect(Collectors.toMap(chartDO->chartDO.getStringDay(),chartDO->{
            AgentDevelopChartDO chartDO1 = new AgentDevelopChartDO();
            if (chartDO.getFirstAgentId() !=null && param.getUserId().intValue() == chartDO.getFirstAgentId().intValue()){
                chartDO1.setTodayCount(1);
            }else{
                chartDO1.setTodayCount(0);
            }
            chartDO1.setStringDay(chartDO.getStringDay());
            chartDO1.setOrderBy(chartDO.getOrderBy());
            return chartDO1;
        },(k1,k2)->{
            k1.setTodayCount(k1.getTodayCount()+k2.getTodayCount());
            return k1;
        }));
        logger.info(">>>>>>>>>>用户级 整理之后的map<<<<<<<<<<"+JSONArray.toJSONString(tempMap));
        List<AgentDevelopChartDO> finalList = new ArrayList<>();
        tempMap.forEach((key,value)->{
            finalList.add(value);
        });
        finalList.sort(Comparator.comparingInt(AgentDevelopChartDO::getOrderBy));
        return finalList;
    }

    @Override
    public Integer getUserLevelBeforePeopleNum(AgentDevelopChartQueryVo param) {
        return agentDevelopChartMapper.getUserLevelBeforePeopleNum(param);
    }

}
