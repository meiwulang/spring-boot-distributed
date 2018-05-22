package com.jdy.b2b.web.pojo.front;

import java.io.Serializable;

/**
 * Created by dugq on 2017/9/23.
 */
public class ScheduleListDetailRequestParam implements Serializable {
    private static final long serialVersionUID = -75974970541736530L;

    private String city_code;   //投放城市
    private Integer  limit;     //每页行数
    private Long  p_id;    //产品id
    private Integer   page;   //分页

    public String getCity_code() {
        return city_code;
    }

    public void setCity_code(String city_code) {
        this.city_code = city_code;
    }

    public Integer getLimit() {
        return limit;
    }

    public void setLimit(Integer limit) {
        this.limit = limit;
    }

    public Long getP_id() {
        return p_id;
    }

    public void setP_id(Long p_id) {
        this.p_id = p_id;
    }

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }
}
