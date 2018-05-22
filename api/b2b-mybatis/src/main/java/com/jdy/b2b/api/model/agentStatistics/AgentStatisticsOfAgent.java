package com.jdy.b2b.api.model.agentStatistics;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

/**
 * Created by dugq on 2017/11/9.
 */
public class AgentStatisticsOfAgent implements Serializable{
    private static final long serialVersionUID = 1251795722684696943L;
    //今天总数
    private Integer num;
    //历史总数，包括今天
    private Integer totalNum;
    private List<AgentStatisticsOfAgent> children;
    private String agentName;
    private LocalDate createTime;

    public Integer getTotalNum() {
        return totalNum;
    }

    public void setTotalNum(Integer totalNum) {
        this.totalNum = totalNum;
    }

    public LocalDate getCreateTime() {
        return createTime;
    }

    public void setCreateTime(LocalDate createTime) {
        this.createTime = createTime;
    }

    public Integer getNum() {
        return num;
    }

    public void setNum(Integer num) {
        this.num = num;
    }

    public List<AgentStatisticsOfAgent> getChildren() {
        return children;
    }

    public void setChildren(List<AgentStatisticsOfAgent> children) {
        this.children = children;
    }

    public String getAgentName() {
        return agentName;
    }

    public void setAgentName(String agentName) {
        this.agentName = agentName;
    }
}
