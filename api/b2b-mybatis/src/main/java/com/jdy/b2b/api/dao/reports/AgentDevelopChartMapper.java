package com.jdy.b2b.api.dao.reports;

import com.jdy.b2b.api.model.reports.AgentDevelopChartDO;
import com.jdy.b2b.api.model.reports.AgentDevelopChartQueryVo;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * Created by yangcheng on 2017/11/10.
 */
@Mapper
public interface AgentDevelopChartMapper {
    List<AgentDevelopChartDO> getAgentCount(AgentDevelopChartQueryVo param);

    Integer getBeforePeopleNum( AgentDevelopChartQueryVo param);

    int syncOrderData(String dateStr);

    int deleteFailedData(String dateStr);

    List<AgentDevelopChartDO> getUserLevelAgentCount(AgentDevelopChartQueryVo param);

    Integer getUserLevelBeforePeopleNum(AgentDevelopChartQueryVo param);
}
