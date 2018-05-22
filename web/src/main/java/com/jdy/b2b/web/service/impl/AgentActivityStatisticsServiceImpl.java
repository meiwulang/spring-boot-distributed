package com.jdy.b2b.web.service.impl;

import com.jdy.b2b.web.pojo.reports.AgentActivityQueryVO;
import com.jdy.b2b.web.service.AgentActivityStatisticsService;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.stereotype.Service;

/**
 * 代理人活跃度统计服务实现类
 * @author chris
 * @since Jan 09.18
 */
@Service
public class AgentActivityStatisticsServiceImpl extends BaseService implements AgentActivityStatisticsService {

    @Override
    public ResultBean selectAgentActivityOfTotalCompany(AgentActivityQueryVO param) {
        String url = super.getReportsCenterUrl() + "agentActivityStatistics/queryAgentActivityOfTotalCompany";
        return super.restTemplate.postForEntity(url.toString(), param, ResultBean.class).getBody();
    }

    @Override
    public ResultBean selectAgentActivityOfDeptByCompany(AgentActivityQueryVO param) {
        String url = super.getReportsCenterUrl() + "agentActivityStatistics/queryAgentActivityOfDeptByCompany";
        return super.restTemplate.postForEntity(url.toString(), param, ResultBean.class).getBody();
    }

    @Override
    public ResultBean selectAgentActivityOfSalesManagerByDept(AgentActivityQueryVO param) {
        String url = super.getReportsCenterUrl() + "agentActivityStatistics/queryAgentActivityOfSalesManagerByDept";
        return super.restTemplate.postForEntity(url.toString(), param, ResultBean.class).getBody();
    }

    @Override
    public ResultBean selectAgentActivityOfSalesManagerByCompany(AgentActivityQueryVO param) {
        String url = super.getReportsCenterUrl() + "agentActivityStatistics/queryAgentActivityOfSalesManagerByCompany";
        return super.restTemplate.postForEntity(url.toString(), param, ResultBean.class).getBody();
    }

    @Override
    public ResultBean selectAgentActivityBySalesManager(AgentActivityQueryVO param) {
        String url = super.getReportsCenterUrl() + "agentActivityStatistics/queryAgentActivityBySalesManager";
        return super.restTemplate.postForEntity(url.toString(), param, ResultBean.class).getBody();
    }
}
