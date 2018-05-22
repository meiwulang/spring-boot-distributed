package com.jdy.b2b.web.service;

import com.jdy.b2b.web.pojo.reports.AgentDevelopChartQueryVo;
import com.jdy.b2b.web.util.ResultBean;

/**
 * Created by strict on 2017/12/7.
 */
public interface AgentDevelopChartService {


    ResultBean agentCount(AgentDevelopChartQueryVo vo);
}
