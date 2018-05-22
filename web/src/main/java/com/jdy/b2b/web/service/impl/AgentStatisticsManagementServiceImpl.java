package com.jdy.b2b.web.service.impl;

import com.alibaba.fastjson.JSON;
import com.jdy.b2b.web.pojo.agentNumberStatistics.AgentStatisticsPram;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

/**
 * Created by dugq on 2017/11/10.
 */
@Service
public class AgentStatisticsManagementServiceImpl extends BaseService implements com.jdy.b2b.web.service.AgentStatisticsManagementService {
    private String totalAgentNumberTrendUrl;
    private String totalAgentNumberTrendByDepartmentUrl;
    private String totalAgentNumberGroupByDepartmentUrl;
    private String newAgentNumberStatisticsByDepartmentUrl;
    private String totalAgentNumberInDepartmentGroupByAgentUrl;
    private String newAgentNumberStatisticsUrl;

    private String companyLevelGroupByDepartmentUrl;
    private String departmentLevelGroupByAgentUrl;
    private String agentLevelGroupByTimeUrl;
    private String companyLevelGroupByTimeUrl;
    private String timeLevelGroupByDepartmentUrl;
    private String timeLevelGroupByAgentUrl;

    private String systemLevelGroupByChildCompanyOrFirstDepartUrl;
    private String systemLevelGroupByTimeUrl;

    private String dealAgentUrl;


    @PostConstruct
    private void initUrl(){
        totalAgentNumberTrendUrl = reportsCenterUrl + "agentStatisticsManagement/agentNumberStatistics";
        totalAgentNumberTrendByDepartmentUrl = reportsCenterUrl + "agentStatisticsManagement/agentNumberStatisticsByDepartment";
        totalAgentNumberGroupByDepartmentUrl = reportsCenterUrl + "agentStatisticsManagement/totalAgentNumberStatisticsGroupByDepartment";
        newAgentNumberStatisticsByDepartmentUrl = reportsCenterUrl + "agentStatisticsManagement/newAgentNumberStatisticsByDepartment";
        totalAgentNumberInDepartmentGroupByAgentUrl = reportsCenterUrl + "agentStatisticsManagement/totalAgentNumberInDepartmentGroupByAgent";
        newAgentNumberStatisticsUrl = reportsCenterUrl + "agentStatisticsManagement/newAgentNumberStatistics";

        companyLevelGroupByDepartmentUrl = reportsCenterUrl + "agentStatisticsManagement/companyLevelGroupByDepartment";
        departmentLevelGroupByAgentUrl = reportsCenterUrl + "agentStatisticsManagement/departmentLevelGroupByAgent";
        agentLevelGroupByTimeUrl = reportsCenterUrl + "agentStatisticsManagement/agentLevelGroupByTime";
        companyLevelGroupByTimeUrl = reportsCenterUrl + "agentStatisticsManagement/companyLevelGroupByTime";
        timeLevelGroupByDepartmentUrl = reportsCenterUrl + "agentStatisticsManagement/timeLevelGroupByDepartment";
        timeLevelGroupByAgentUrl = reportsCenterUrl + "agentStatisticsManagement/timeLevelGroupByAgent";

        systemLevelGroupByChildCompanyOrFirstDepartUrl = reportsCenterUrl + "agentStatisticsManagement/systemLevelGroupByChildCompanyOrFirstDepart";
        systemLevelGroupByTimeUrl = reportsCenterUrl + "agentStatisticsManagement/systemLevelGroupByTime";

        dealAgentUrl = reportsCenterUrl + "agentStatisticsManagement/dealAgent";
    }
    @Override
    public ResultBean totalAgentNumberTrend(AgentStatisticsPram param){
        Object o = JSON.toJSON(param);
        return restTemplate.postForObject(totalAgentNumberTrendUrl,o, ResultBean.class);
    }

    @Override
    public ResultBean totalAgentNumberTrendByDepartment(AgentStatisticsPram param) {
            return restTemplate.postForEntity(totalAgentNumberTrendByDepartmentUrl,param, ResultBean.class).getBody();
    }

    @Override
    public ResultBean totalAgentNumberGroupByDepartment(AgentStatisticsPram param) {
            return restTemplate.postForEntity(totalAgentNumberGroupByDepartmentUrl,param, ResultBean.class).getBody();
    }

    @Override
    public ResultBean newAgentNumberStatisticsByDepartment(AgentStatisticsPram param) {
            return restTemplate.postForEntity(newAgentNumberStatisticsByDepartmentUrl,param, ResultBean.class).getBody();
    }

    @Override
    public ResultBean totalAgentNumberInDepartmentGroupByAgent(AgentStatisticsPram param) {
            return restTemplate.postForEntity(totalAgentNumberInDepartmentGroupByAgentUrl,param, ResultBean.class).getBody();
    }

    @Override
    public ResultBean newAgentNumberStatistics(AgentStatisticsPram param){
            return restTemplate.postForEntity(newAgentNumberStatisticsUrl,param, ResultBean.class).getBody();
    }

    @Override
    public ResultBean companyLevelGroupByDepartment(AgentStatisticsPram param) {
            return restTemplate.postForEntity(companyLevelGroupByDepartmentUrl,param, ResultBean.class).getBody();
    }

    @Override
    public ResultBean departmentLevelGroupByAgent(AgentStatisticsPram param) {
        return restTemplate.postForEntity(departmentLevelGroupByAgentUrl,param, ResultBean.class).getBody();
    }

    @Override
    public ResultBean agentLevelGroupByTime(AgentStatisticsPram param) {
        return restTemplate.postForEntity(agentLevelGroupByTimeUrl,param, ResultBean.class).getBody();
    }

    @Override
    public ResultBean companyLevelGroupByTime(AgentStatisticsPram param) {
        return restTemplate.postForEntity(companyLevelGroupByTimeUrl,param, ResultBean.class).getBody();
    }

    @Override
    public ResultBean TimeLevelGroupByDepartment(AgentStatisticsPram param) {
        return restTemplate.postForEntity(timeLevelGroupByDepartmentUrl,param, ResultBean.class).getBody();
    }

    @Override
    public ResultBean timeLevelGroupByAgent(AgentStatisticsPram param) {
        return restTemplate.postForEntity(timeLevelGroupByAgentUrl,param, ResultBean.class).getBody();
    }

    //startDate type tableType
    @Override
    public ResultBean systemLevelGroupByChildCompanyOrFirstDepart(AgentStatisticsPram param) {
        return restTemplate.postForEntity(systemLevelGroupByChildCompanyOrFirstDepartUrl,param, ResultBean.class).getBody();
    }

    //startDate type tableType
    @Override
    public ResultBean systemLevelGroupByTime(AgentStatisticsPram param) {
        return restTemplate.postForEntity(systemLevelGroupByTimeUrl,param, ResultBean.class).getBody();
    }

    @Override
    public ResultBean dealAgent(AgentStatisticsPram param) {
        return restTemplate.postForEntity(dealAgentUrl,param, ResultBean.class).getBody();
    }

}
