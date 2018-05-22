package com.jdy.b2b.api.model.scheduleplan;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by yangcheng on 2017/12/7.
 */
public class SchedulePlanAllSumDO {
    /*private Map<Long,Map<String,Long>> sumMap = new HashMap<>();

    public Map<Long, Map<String, Long>> getSumMap() {
        return sumMap;
    }

    public void setSumMap(Map<Long, Map<String, Long>> sumMap) {
        this.sumMap = sumMap;
    }*/


    private Long ticketId;
    private Integer flag; //0 预约  1:已付
    private Long peopleNum;

    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }

    public Integer getFlag() {
        return flag;
    }

    public void setFlag(Integer flag) {
        this.flag = flag;
    }

    public Long getPeopleNum() {
        return peopleNum;
    }

    public void setPeopleNum(Long peopleNum) {
        this.peopleNum = peopleNum;
    }
}

