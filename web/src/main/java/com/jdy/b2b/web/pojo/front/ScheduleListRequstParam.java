package com.jdy.b2b.web.pojo.front;

import io.swagger.models.auth.In;

import java.io.Serializable;
import java.util.Date;

/**
 * Created by dugq on 2017/9/19.
 */
public class ScheduleListRequstParam implements Serializable {
    private static final long serialVersionUID = -6889427413021680371L;

    private String business;  // 商家信息（品牌）
    private String city_code;          //投放城市
    private Integer days; //行程天数
    private String destination; //目的地
    private Date startDate; //开始时间
    private Integer type;  //产品类型
    private Integer only_cluster;

    public Integer getOnly_cluster() {
        return only_cluster;
    }

    public void setOnly_cluster(Integer only_cluster) {
        this.only_cluster = only_cluster;
    }

    public String getBusiness() {
        return business;
    }

    public void setBusiness(String business) {
        this.business = business;
    }

    public String getCity_code() {
        return city_code;
    }

    public void setCity_code(String city_code) {
        this.city_code = city_code;
    }

    public Integer getDays() {
        return days;
    }

    public void setDays(Integer days) {
        this.days = days;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }
}
