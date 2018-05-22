package com.jdy.b2b.web.pojo.front;


import com.jdy.b2b.web.util.BaseVO;

import java.io.Serializable;

/**
 * Created by dugq on 2017/9/20.
 */
public class ScheduleCalendarRequestParam implements Serializable{
    private static final long serialVersionUID = 1217999206316811538L;
    private String city_code;   //城市编号
    private Integer month;    //月份
    private Long p_id;   //产品id
    private Integer year;  //年份
    private String startDate;
    private String endDate;
    private Long userId;
    private String from;

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public String getCity_code() {
        return city_code;
    }

    public void setCity_code(String city_code) {
        this.city_code = city_code;
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public Long getP_id() {
        return p_id;
    }

    public void setP_id(Long p_id) {
        this.p_id = p_id;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }
}
