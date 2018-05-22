package com.jdy.b2b.api.dao.reports;

import com.jdy.b2b.api.model.reports.AgentActivityQueryDTO;
import com.jdy.b2b.api.model.reports.AgentActivityResultDO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * 代理人活跃度统计Mapper
 * @author chris
 * @since Jan 6.18
 */
@Mapper
public interface AgentActivityStatisticsMapper {
    /**
     * 查询总公司代理人活跃度
     * @param param
     * @return
     */
    List<AgentActivityResultDO> selectAgentActivityOfTotalCompany(AgentActivityQueryDTO param);

    /**
     * 根据子公司查询部门代理人活跃度
     * @param param
     * @return
     */
    List<AgentActivityResultDO> selectAgentActivityOfDeptByCompany(AgentActivityQueryDTO param);

    /**
     * 根据部门查询销售经理下代理人活跃度
     * @param param
     * @return
     */
    List<AgentActivityResultDO> selectAgentActivityOfSalesManagerByDept(AgentActivityQueryDTO param);

    /**
     * 根据公司查询销售经理下代理人活跃度
     * @param param
     * @return
     */
    List<AgentActivityResultDO> selectAgentActivityOfSalesManagerByCompany(AgentActivityQueryDTO param);

    /**
     * 根据销售经理查询代理人活跃度
     * @param param
     * @return
     */
    List<AgentActivityResultDO> selectAgentActivityBySalesManager(AgentActivityQueryDTO param);

}
