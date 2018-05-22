package com.jdy.b2b.api.model.agentStatistics;


import com.jdy.b2b.api.common.OneTuple;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.function.Predicate;
import java.util.stream.Collectors;

/**
 * Created by dugq on 2017/12/5.
 */
public enum TableTypeEnum {

    //单位级 按部门分组 无条件
    ONE_ONE_FIVE(115) {
        @Override
        public <T extends BaseAgentStatistics> List<T> groupBy(List<AgentStatistics> agents,AgentStatisticsPram param) {
           return groupByDepartment(agents);
        }

        @Override
        public List<AgentStatistics> predicate(OneTuple<Integer> total, AgentStatisticsPram param, List<AgentStatistics> agentStatistics) {
            return predicateByTime(total, param, agentStatistics);
        }

    },

    //单位级 按时间分组 无条件
    ONE_TWO_FIVE(125) {
        @Override
        public <T extends BaseAgentStatistics> List<T> groupBy(List<AgentStatistics> agents,AgentStatisticsPram param) {
          return groupByTime(agents, param);
        }

        @Override
        public List<AgentStatistics> predicate(OneTuple<Integer> total, AgentStatisticsPram param, List<AgentStatistics> agentStatistics) {
            return predicateChildrenByTime(total, param, agentStatistics);
        }

    },

    // 部门级 按人员（销售经理）分组  条件为部门id
    TWO_THREE_ONE(231) {
        @Override
        public <T extends BaseAgentStatistics> List<T> groupBy(List<AgentStatistics> agents,AgentStatisticsPram param) {
            return (List<T>) agents;
        }

        @Override
        public List<AgentStatistics> predicate(OneTuple<Integer> total, AgentStatisticsPram param, List<AgentStatistics> agentStatistics) {
            return predicateByTime(total,param,agentStatistics);
        }
    },

    //部门级 按时间分组  条件为部门id
    TWO_TWO_ONE(221) {
        @Override
        public <T extends BaseAgentStatistics> List<T> groupBy(List<AgentStatistics> agents,AgentStatisticsPram param) {
            return groupByTime(agents, param);
        }

        @Override
        public List<AgentStatistics> predicate(OneTuple<Integer> total, AgentStatisticsPram param, List<AgentStatistics> agentStatistics) {
            return ONE_TWO_FIVE.predicate(total,param,agentStatistics);
        }

    },
    //单位级 按部门分组  条件为单位id和时间段
    ONE_ONE_SIX(116) {
        @Override
        public <T extends BaseAgentStatistics> List<T> groupBy(List<AgentStatistics> agents,AgentStatisticsPram param) {
            return groupByDepartment(agents);
        }

        @Override
        public List<AgentStatistics> predicate(OneTuple<Integer> total, AgentStatisticsPram param, List<AgentStatistics> agentStatistics) {
            return predicateByTime(total,param,agentStatistics);
        }

    },

    //单位级 按 人员（销售经理）分组  条件为单位id和时间段
    ONE_THREE_SIX(136) {
        @Override
        public <T extends BaseAgentStatistics> List<T> groupBy(List<AgentStatistics> agents,AgentStatisticsPram param) {
            return (List<T>) agents;
        }

        @Override
        public List<AgentStatistics> predicate(OneTuple<Integer> total, AgentStatisticsPram param, List<AgentStatistics> agentStatistics) {
            return predicateByTime(total,param,agentStatistics);
        }

    },

    //部门级 按人员（销售经理）分组  条件为部门+时间断
    TWO_THREE_FOUR(234){
        @Override
        public <T extends BaseAgentStatistics> List<T> groupBy(List<AgentStatistics> agents,AgentStatisticsPram param) {
            return (List<T>) agents;
        }

        @Override
        public List<AgentStatistics> predicate(OneTuple<Integer> total, AgentStatisticsPram param, List<AgentStatistics> agentStatistics) {
            return predicateByTime(total,param,agentStatistics);
        }

    },

    //用户级 按时间段分组  条件为人员（销售经理）
    THREE_TWO_TWO(322){
        @Override
        public <T extends BaseAgentStatistics> List<T> groupBy(List<AgentStatistics> agents,AgentStatisticsPram param) {
            return groupByTime(agents, param);
        }

        @Override
        public List<AgentStatistics> predicate(OneTuple<Integer> total, AgentStatisticsPram param, List<AgentStatistics> agentStatistics) {
            return predicateChildrenByTime(total, param, agentStatistics);
        }

    },
    //系统级 按子公司/部门分组  无条件
    //startDate type tableType
    FOUR_FOUR_ZERO(440){
        @Override
        public <T extends BaseAgentStatistics> List<T> groupBy(List<AgentStatistics> agents,AgentStatisticsPram param) {
           return groupByCompanyAndDepartment(agents);
        }

        @Override
        public List<AgentStatistics> predicate(OneTuple<Integer> total, AgentStatisticsPram param, List<AgentStatistics> agentStatistics) {
            return predicateChildrenByTime(total, param, agentStatistics);
        }

    },

    //系统级 时间  无条件
    //startDate type tableType
    FOUR_TWO_ZERO(420){
        @Override
        public <T extends BaseAgentStatistics> List<T> groupBy(List<AgentStatistics> agents,AgentStatisticsPram param) {
            return groupByTime(agents, param);
        }

        @Override
        public List<AgentStatistics> predicate(OneTuple<Integer> total, AgentStatisticsPram param, List<AgentStatistics> agentStatistics) {
            return predicateChildrenByTime(total, param, agentStatistics);
        }

    }
    ;

    /**
     * 用以区分查询类型
     * 共分三位
     * 第一位表示最小权限：1：单位级 2：部门级 3：用户级   注意和dataLimit不一样，dataLimit和数据库意义相同。这里由于在第一位不能用0 所以自定义了
     * 添加系统级数据权限 --- 4:系统级
     *
     * 第二位表示分组条件：1：部门： 2：时间  3： 人员（销售经理）
     * 添加系统级分组条件 --- 4:子公司/一级部门
     * 第三位表示由上层传下来的条件：1：部门： 2：人员（销售经理）  3： 时间段  4:部门+时间段 5：单位 6：时间+单位  无条件的用0
     *
     */
    private int value;

    public abstract  <T extends BaseAgentStatistics> List<T> groupBy(List<AgentStatistics> agents,AgentStatisticsPram param);

    public abstract List<AgentStatistics> predicate( OneTuple<Integer> total,AgentStatisticsPram param,List<AgentStatistics> agentStatistics);

    TableTypeEnum(int value) {
        this.value = value;
    }


    public static TableTypeEnum ofValue(int type){
        for(TableTypeEnum tableType : TableTypeEnum.values()){
            if(tableType.getValue() == type){
                return tableType;
            }
        }
        throw new UnsupportedOperationException("no such tableType :"+type);
    }
    public int getValue() {
        return value;
    }


    protected <T extends BaseAgentStatistics> List<T> groupByTime(List<AgentStatistics> agents,AgentStatisticsPram param){
        List<AgentStatisticsGroupByTime> list = new LinkedList<>();
        Map<Integer, List<AgentStatistics>> agentsGroupByTime = agents.stream().collect(StatisticsType.ofValue(param.getType()).groupBy());
        agentsGroupByTime.forEach((key, value) -> {
            AgentStatisticsGroupByTime agent = StatisticsType.ofValue(param.getType()).builderAgentStatistics(key,value);
            list.add(agent);
        });
        return (List<T>) list;
    }


    protected <T extends BaseAgentStatistics> List<T> groupByDepartment(List<AgentStatistics> statisticsList){
        List<AgentStatisticsGroupByDepartment> list = new LinkedList<>();
        //将一级代理人按部门分组
        Map<Long, List<AgentStatistics>> collect = statisticsList.stream().collect(Collectors.groupingBy(agent -> agent.getDepartmentId()));
        //遍历按部门分组后的map，根据一级代理人集合构建新的部门并加入的部门列表
        collect.forEach((id, agents) -> {
            AgentStatisticsGroupByDepartment agent = new AgentStatisticsGroupByDepartment(agents);
            list.add(agent);
        });
        return (List<T>) list;
    }

    protected <T extends BaseAgentStatistics> List<T> groupByCompanyAndDepartment(List<AgentStatistics> agents){
        List<BaseAgentStatistics> list = new LinkedList<>();
        Map<Long, List<AgentStatistics>> agentsGroupByTime = agents.stream().collect(Collectors.groupingBy(agent -> agent.getCompanyId()));
        agentsGroupByTime.forEach((key, value) -> {
            if(key == 0){
                List<BaseAgentStatistics> departmentList = groupByDepartment(value);
                list.addAll(departmentList);
            }else{
                AgentStatisticsGroupByCompany companyStatistics = new AgentStatisticsGroupByCompany();
                companyStatistics.setCompanyId(key);
                companyStatistics.setCompanyName(value.get(0).getCompanyName());
                companyStatistics.setFirstAgents(value);
                companyStatistics.setNum(value.size());
                list.add(companyStatistics);
            }
        });
        return (List<T>) list;
    }

    protected List<AgentStatistics> predicateByTime( OneTuple<Integer> total,AgentStatisticsPram param,List<AgentStatistics> agentStatistics){
        return agentStatistics.stream().filter(agent -> {
            int num = agent.countNumIncludeSelf(param);
            total.setA(total.getA() + num);
            agent.setNum(num);
            return num>0;
        }).collect(Collectors.toList());
    }

    protected List<AgentStatistics> predicateChildrenByTime( OneTuple<Integer> total,AgentStatisticsPram param,List<AgentStatistics> agentStatistics){
        Predicate<AgentStatistics> filterConditions = agent -> {
            boolean dateInRange = agent.isDateInRange(param.getStartDate(), param.getEndDate());
            if(dateInRange){
                total.setA(total.getA() + 1);
            }
            agent.setNum(1);
            return dateInRange;
        };
        return agentStatistics.stream().flatMap(agents -> agents.allChildrenIncludeSelf().stream()).filter(filterConditions).collect(Collectors.toList());
    }
}
