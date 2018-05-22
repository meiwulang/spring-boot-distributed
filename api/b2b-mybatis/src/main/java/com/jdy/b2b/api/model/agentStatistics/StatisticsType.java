package com.jdy.b2b.api.model.agentStatistics;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collector;
import java.util.stream.Collectors;

/**
 * Created by dugq on 2017/12/5.
 */
public enum StatisticsType {
    TOTAL(0) {
        @Override
        public Collector<AgentStatistics, ?, Map<Integer, List<AgentStatistics>>> groupBy() {
            return Collectors.groupingBy(agent -> agent.getTime().getYear());
        }

        @Override
        public AgentStatisticsGroupByTime builderAgentStatistics(int level, List<AgentStatistics> agentStatistics) {
            throw new UnsupportedOperationException();
        }
    },MONTH(1) {
        @Override
        public Collector<AgentStatistics, ?, Map<Integer, List<AgentStatistics>>> groupBy() {
            return Collectors.groupingBy(agent -> agent.getTime().getDayOfMonth());
        }

        @Override
        public AgentStatisticsGroupByTime builderAgentStatistics(int level, List<AgentStatistics> agentStatistics) {
            AgentStatisticsGroupByTime agentStatisticsGroupByTime = new AgentStatisticsGroupByTime(level,agentStatistics);
            agentStatisticsGroupByTime.setTimeRange(agentStatistics.get(0).getTime().format(DateTimeFormatter.ofPattern("yyyy年MM月dd日")));
            return agentStatisticsGroupByTime;
        }
    },DAY(2) {
        @Override
        public Collector<AgentStatistics, ?, Map<Integer, List<AgentStatistics>>> groupBy() {
            return Collectors.groupingBy(agent -> agent.getShortTime().getHour() / AgentStatisticsGroupByTime.TIME_INTERVAL);
        }

        @Override
        public AgentStatisticsGroupByTime builderAgentStatistics(int level, List<AgentStatistics> agentStatistics) {
            return  new AgentStatisticsGroupByTime(agentStatistics, level);
        }
    },WEEK(3) {
        @Override
        public Collector<AgentStatistics, ?, Map<Integer, List<AgentStatistics>>> groupBy() {
            return Collectors.groupingBy(agent -> agent.getTime().getDayOfWeek().getValue());
        }

        @Override
        public AgentStatisticsGroupByTime builderAgentStatistics(int level, List<AgentStatistics> agentStatistics) {
            AgentStatisticsGroupByTime agentStatisticsGroupByTime = new AgentStatisticsGroupByTime(level,agentStatistics);
            agentStatisticsGroupByTime.setTimeRange(weekName[level-1]);
            return agentStatisticsGroupByTime;
        }
    }, SEASON(4) {
        @Override
        public Collector<AgentStatistics, ?, Map<Integer, List<AgentStatistics>>> groupBy() {
            return Collectors.groupingBy(agent -> agent.getTime().getMonthValue());
        }

        @Override
        public AgentStatisticsGroupByTime builderAgentStatistics(int level, List<AgentStatistics> agentStatistics) {
            AgentStatisticsGroupByTime agentStatisticsGroupByTime = new AgentStatisticsGroupByTime((level-1)%3,agentStatistics);
            agentStatisticsGroupByTime.setTimeRange(agentStatistics.get(0).getTime().format(DateTimeFormatter.ofPattern("yyyy年MM月")));
            return agentStatisticsGroupByTime;
        }
    },YEAR(5) {
        @Override
        public Collector<AgentStatistics, ?, Map<Integer, List<AgentStatistics>>> groupBy() {
            return Collectors.groupingBy(agent -> (agent.getTime().getMonthValue()-1)/3);
        }

        @Override
        public AgentStatisticsGroupByTime builderAgentStatistics(int level, List<AgentStatistics> agentStatistics) {
            AgentStatisticsGroupByTime agentStatisticsGroupByTime = new AgentStatisticsGroupByTime(level,agentStatistics);
            agentStatisticsGroupByTime.setTimeRange(seasonName[level]);
            return agentStatisticsGroupByTime;
        }
    };

    private int value;

    StatisticsType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public static StatisticsType ofValue(int type){
        for(StatisticsType tableType : StatisticsType.values()){
            if(Objects.equals(tableType.getValue(),type)){
                return tableType;
            }
        }
        throw new RuntimeException("no such type");
    }
    protected String weekName[] = {"周一","周二","周三","周四","周五","周六","周日"};
    protected String seasonName[] = {"第一季度","第二季度","第三季度","第四季度"};

    public abstract Collector<AgentStatistics, ?, Map<Integer, List<AgentStatistics>>> groupBy();

    public abstract AgentStatisticsGroupByTime builderAgentStatistics(int level,List<AgentStatistics> agentStatistics);
}
