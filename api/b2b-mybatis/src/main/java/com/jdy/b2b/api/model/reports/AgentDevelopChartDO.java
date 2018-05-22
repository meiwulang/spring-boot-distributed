package com.jdy.b2b.api.model.reports;

/**
 * Created by yangcheng on 2017/11/10.
 */
public class AgentDevelopChartDO {
    private Integer orderBy;
    private String stringDay;
    private Integer todayCount;
    private Long firstAgentId;

    public String getStringDay() {
        return stringDay;
    }

    public void setStringDay(String stringDay) {
        this.stringDay = stringDay;
    }

    public Integer getOrderBy() {
        return orderBy;
    }

    public void setOrderBy(Integer orderBy) {
        this.orderBy = orderBy;
    }

    public Integer getTodayCount() {
        return todayCount;
    }

    public void setTodayCount(Integer todayCount) {
        this.todayCount = todayCount;
    }

    public Long getFirstAgentId() {
        return firstAgentId;
    }

    public void setFirstAgentId(Long firstAgentId) {
        this.firstAgentId = firstAgentId;
    }
}
