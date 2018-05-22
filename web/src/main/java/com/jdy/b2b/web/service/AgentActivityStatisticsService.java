package com.jdy.b2b.web.service;

import com.jdy.b2b.web.pojo.reports.AgentActivityQueryVO;
import com.jdy.b2b.web.util.ResultBean;


/**
 * 代理人活跃度统计服务接口
 * @author chris
 * @since Jan 09.18
 */
public interface AgentActivityStatisticsService {
    /**
     * 查询总公司代理人活跃度
     * @param param
     * @return
     */
    ResultBean selectAgentActivityOfTotalCompany(AgentActivityQueryVO param);

    /**
     * 根据子公司查询部门代理人活跃度
     * @param param
     * @return
     */
    ResultBean selectAgentActivityOfDeptByCompany(AgentActivityQueryVO param);

    /**
     * 根据部门查询销售经理代理人活跃度
     * @param param
     * @return
     */
    ResultBean selectAgentActivityOfSalesManagerByDept(AgentActivityQueryVO param);

    /**
     * 根据分公司查询销售经理代理人活跃度
     * @param param
     * @return
     */
    ResultBean selectAgentActivityOfSalesManagerByCompany(AgentActivityQueryVO param);

    /**
     * 根据销售经理查询代理人活跃度
     * @param param
     * @return
     */
    ResultBean selectAgentActivityBySalesManager(AgentActivityQueryVO param);
}
