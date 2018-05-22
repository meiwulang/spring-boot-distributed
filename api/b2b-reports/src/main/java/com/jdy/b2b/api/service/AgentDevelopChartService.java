package com.jdy.b2b.api.service;

import com.jdy.b2b.api.model.reports.AgentDevelopChartDO;
import com.jdy.b2b.api.model.reports.AgentDevelopChartQueryVo;

import java.util.Collection;
import java.util.List;

/**
 * Created by yangcheng on 2017/11/10.
 */
public interface AgentDevelopChartService {
    List<AgentDevelopChartDO> getAgentCount(AgentDevelopChartQueryVo param);

    Integer getBeforePeopleNum(AgentDevelopChartQueryVo param);

    int syncOrderData(String dateStr);

    Collection<AgentDevelopChartDO> getUserLevelCount(AgentDevelopChartQueryVo param);

    Integer getUserLevelBeforePeopleNum(AgentDevelopChartQueryVo param);
}
