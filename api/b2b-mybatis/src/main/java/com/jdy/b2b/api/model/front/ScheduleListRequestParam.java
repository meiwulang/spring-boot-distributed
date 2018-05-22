package com.jdy.b2b.api.model.front;

import java.io.Serializable;
import java.util.Date;

/**
 * Created by dugq on 2017/9/19.
 */
public class ScheduleListRequestParam implements Serializable {
    private static final long serialVersionUID = -6889427413021680371L;

    private String business;  // 商家信息（品牌）
    private String city_code;          //投放城市
    private Integer days; //行程天数
    private String destination; //目的地
    private Date startDate; //开始时间
    private Integer type;  //产品类型
    private String province;
    private int start = 1;  //分页信息
    private Integer only_cluster;
    private Integer limit; //每页行数
    private Integer page; //同start，不同接口使用
    private Long p_id;   //产品id

    public Integer getLimit() {
        return limit;
    }

    public void setLimit(Integer limit) {
        this.limit = limit;
    }

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public Long getP_id() {
        return p_id;
    }

    public void setP_id(Long p_id) {
        this.p_id = p_id;
    }

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

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public int getStart() {
        return start;
    }

    public void setStart(int start) {
        this.start = start;
    }
}
