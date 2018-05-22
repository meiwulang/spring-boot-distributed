package com.jdy.b2b.api.service.Impl;

import com.jdy.b2b.api.dao.reports.AgentActivityStatisticsMapper;
import com.jdy.b2b.api.model.reports.AgentActivityQueryDTO;
import com.jdy.b2b.api.model.reports.AgentActivityResultDO;
import com.jdy.b2b.api.model.reports.AgentActivitySummaryDO;
import com.jdy.b2b.api.service.AgentActivityStatisticsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import java.util.*;

/**
 * 代理人活跃度统计服务实现类
 * @author chris
 * @since Jan 09.18
 */
@Service
public class AgentActivityStatisticsServiceImpl implements AgentActivityStatisticsService{
    @Autowired
    private AgentActivityStatisticsMapper agentActivityStatisticsMapper;

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Override
    public Map<String, Object> selectAgentActivityOfTotalCompany(AgentActivityQueryDTO param) {
        logger.debug("selectAgentActivityOfTotalCompany start.");
        List<AgentActivityResultDO> resultList = this.agentActivityStatisticsMapper.selectAgentActivityOfTotalCompany(param);
        return this.generateResultMap(resultList);
    }

    private Map<String, Object> generateResultMap(List<AgentActivityResultDO> resultList) {
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("summary", new AgentActivitySummaryDO());
        resultMap.put("list", Collections.EMPTY_LIST);
        if (!CollectionUtils.isEmpty(resultList)) {
            final AgentActivitySummaryDO summary = new AgentActivitySummaryDO();
            resultList.forEach(item -> {
                item.setAgentActivity(this.getActivityAfterAddPercentSymbol(item.getAgentActivity()));
                summary.accumulateCalc(item);
            });
            summary.calcTotalAgentActivity();
            summary.setTotalAgentActivity(this.getActivityAfterAddPercentSymbol(summary.getTotalAgentActivity()));
            resultMap.put("summary", summary);
            resultMap.put("list", resultList);
        }
        return resultMap;
    }

    private String getActivityAfterAddPercentSymbol(String activityValue) {
        String dotSymbol = ".";
        if (StringUtils.isEmpty(activityValue)) {
            return "0%";
        }
        if (activityValue.lastIndexOf(dotSymbol) > 0 && "00".equals(activityValue.substring(activityValue.lastIndexOf(dotSymbol) + 1))) {
            return activityValue.substring(0, activityValue.lastIndexOf(dotSymbol)) + "%";
        }
        return activityValue + "%";
    }

    @Override
    public Map<String, Object> selectAgentActivityOfDeptByCompany(AgentActivityQueryDTO param) {
        List<AgentActivityResultDO> resultList = this.agentActivityStatisticsMapper.selectAgentActivityOfDeptByCompany(param);
        return this.generateResultMap(resultList);
    }

    @Override
    public Map<String, Object> selectAgentActivityOfSalesManagerByDept(AgentActivityQueryDTO param) {
        List<AgentActivityResultDO> resultList =this.agentActivityStatisticsMapper.selectAgentActivityOfSalesManagerByDept(param);
        return this.generateResultMap(resultList);
    }

    @Override
    public Map<String, Object> selectAgentActivityOfSalesManagerByCompany(AgentActivityQueryDTO param) {
        List<AgentActivityResultDO> resultList =this.agentActivityStatisticsMapper.selectAgentActivityOfSalesManagerByCompany(param);
        return this.generateResultMap(resultList);
    }


    @Override
    public Map<String, Object> selectAgentActivityBySalesManager(AgentActivityQueryDTO param) {
        List<AgentActivityResultDO> resultList = this.agentActivityStatisticsMapper.selectAgentActivityBySalesManager(param);
        Map<String, Object> resultMap = this.generateResultMap(resultList);
        if (!CollectionUtils.isEmpty(resultMap) && !ObjectUtils.isEmpty(resultMap.get("summary"))
                && !CollectionUtils.isEmpty((resultList))) {
            //销售经理的总代理人数=resultList的size
            ((AgentActivitySummaryDO)resultMap.get("summary")).setTotalAgentNums(resultList.size());
        }
        return resultMap;
    }

}
