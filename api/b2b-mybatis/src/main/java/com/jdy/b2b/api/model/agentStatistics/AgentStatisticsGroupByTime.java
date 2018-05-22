package com.jdy.b2b.api.model.agentStatistics;

import java.io.Serializable;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Created by dugq on 2017/12/4.
 */
public class AgentStatisticsGroupByTime extends BaseAgentStatistics implements Serializable {
    private static final long serialVersionUID = 8038471002444602167L;
    public static final int TIME_INTERVAL = 1;


    private List<AgentStatistics> agents;
    private String timeRange;
    private int timeLevel;

    public AgentStatisticsGroupByTime() {

    }

    public AgentStatisticsGroupByTime(List<AgentStatistics> agents,int timeLevel){
        this.timeLevel = timeLevel;
        this.agents = agents;
        this.num = agents.size();
        LocalTime startTime = LocalTime.of(timeLevel*TIME_INTERVAL,0);
        LocalTime endTime = LocalTime.of((timeLevel+1)*TIME_INTERVAL%24,0);
        this.timeRange = startTime.format(DateTimeFormatter.ofPattern("HH:mm"))+"-"+endTime.format(DateTimeFormatter.ofPattern("HH:mm"));
    }
    public AgentStatisticsGroupByTime(int timeLevel,List<AgentStatistics> agents){
        this.timeLevel = timeLevel;
        this.agents = agents;
        this.num = agents.size();
    }

    public int getTimeLevel() {
        return timeLevel;
    }

    public void setTimeLevel(int timeLevel) {
        this.timeLevel = timeLevel;
    }

    public List<AgentStatistics> getAgents() {
        return agents;
    }

    public void setAgents(List<AgentStatistics> agents) {
        this.agents = agents;
    }

    public String getTimeRange() {
        return timeRange;
    }

    public int getDesNum(){
        return -this.num;
    }

    public void setTimeRange(String timeRange) {
        this.timeRange = timeRange;
    }
}
