package com.jdy.b2b.api.dao.agentStatistics;

import com.jdy.b2b.api.model.agentStatistics.AgentStatistics;
import com.jdy.b2b.api.model.agentStatistics.AgentStatisticsOfAgent;
import com.jdy.b2b.api.model.agentStatistics.AgentStatisticsPram;
import org.apache.ibatis.annotations.MapKey;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * Created by dugq on 2017/11/9.
 */
@Mapper
public interface AgentStatisticsMapper {
    /**
     * 查询代理人总数，可传入单位id，或者部门id查询部门和单位的代理人总数
     * @param param
     * @return 根据department分组的代理人数量
     */

    List<AgentStatistics> selectTotalAgentNumGroupByDepartment(AgentStatisticsPram param);
    /**
     *  查询代理人总数，可传入单位id，或者部门id查询部门和单位的代理人总数
     *  可根据传入的日期不同，查询日新增和月新增
     * @param param
     * @return  根据department分组的代理人数量
     */
    List<AgentStatistics> selectTotalNewAgentNumByTimeGroupByDepartment(AgentStatisticsPram param);

    List<AgentStatisticsOfAgent> selectotalAgentNumberInDepartmentGroupByAgent(AgentStatisticsPram param);

    List<AgentStatisticsOfAgent> selectChildren(AgentStatisticsPram param);


    List<AgentStatistics> agentStatisticsGroupByDepartment(AgentStatisticsPram param);

    List<AgentStatisticsOfAgent> selectAgentsNumByDepartmentIdGroupByAgent(AgentStatisticsPram param);


    /**
     * 获取一级代理人，包括部门信息
     * @param param
     * @return
     */
    List<AgentStatistics> selectFirstLevelAgent(AgentStatisticsPram param);

    List<AgentStatistics> selectAgentsByFirstAgent1(AgentStatisticsPram param);

    List<AgentStatistics> selectAgentsByFirstAgent(AgentStatisticsPram param);

}
