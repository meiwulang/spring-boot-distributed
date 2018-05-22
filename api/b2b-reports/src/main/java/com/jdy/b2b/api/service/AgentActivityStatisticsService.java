package com.jdy.b2b.api.service;

import com.jdy.b2b.api.model.reports.AgentActivityQueryDTO;
import java.util.Map;

/**
 * 代理人活跃度统计service
 * @author chris
 * @since Jan 07.18
 */
public interface AgentActivityStatisticsService {
    /**
     * 查询总公司代理人活跃度
     * @param param
     * @return
     */
    Map<String, Object> selectAgentActivityOfTotalCompany(AgentActivityQueryDTO param);

    /**
     * 根据子公司查询部门代理人活跃度
     * @param param
     * @return
     */
    Map<String, Object> selectAgentActivityOfDeptByCompany(AgentActivityQueryDTO param);

    /**
     * 根据部门查询销售经理代理人活跃度
     * @param param
     * @return
     */
    Map<String, Object> selectAgentActivityOfSalesManagerByDept(AgentActivityQueryDTO param);

     /**
     * 根据分公司查询销售经理代理人活跃度
     * @param param
     * @return
     */
    Map<String, Object> selectAgentActivityOfSalesManagerByCompany(AgentActivityQueryDTO param);

    /**
     * 根据销售经理查询代理人活跃度
     * @param param
     * @return
     */
    Map<String, Object> selectAgentActivityBySalesManager(AgentActivityQueryDTO param);
}
