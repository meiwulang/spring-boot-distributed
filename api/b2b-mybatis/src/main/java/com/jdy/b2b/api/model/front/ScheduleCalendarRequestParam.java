package com.jdy.b2b.api.model.front;


import com.jdy.b2b.api.common.BaseVO;

import java.io.Serializable;

/**
 * Created by dugq on 2017/9/20.
 */
public class ScheduleCalendarRequestParam implements Serializable{
    private static final long serialVersionUID = 1217999206316811538L;
    private String city_code;   //城市编号
    private int month;    //月份
    private Long p_id;   //产品id
    private int year;  //年份
    private String startDate;
    private String endDate;
    private Long UserId;
    private String from;
    private Long companyId;

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public Long getUserId() {
        return UserId;
    }

    public void setUserId(Long userId) {
        UserId = userId;
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

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public Long getP_id() {
        return p_id;
    }

    public void setP_id(Long p_id) {
        this.p_id = p_id;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }
}
