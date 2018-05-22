package com.jdy.b2b.api.model.advertisement;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by yangcheng on 2017/9/20.
 */
public class IndexAdverDO {
    private Long id;
    private String ad_place;
    private String ad_sarea;
    private Date beginDate;
    private Date endDate;
    private Integer ad_stime;
    private Integer ad_etime;
    private String ad_opentype;
    private String ad_title;
    private String ad_pic;
    private String ad_content;
    private String ad_url;
    private Integer ad_order;
    private String ad_price;//java表中的'其他内容'字段
    private List<String> citys = new ArrayList<String>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<String> getCitys() {
        return citys;
    }

    public void setCitys(List<String> citys) {
        this.citys = citys;
    }

    public String getAd_place() {
        return ad_place;
    }

    public void setAd_place(String ad_place) {
        this.ad_place = ad_place;
    }

    public String getAd_sarea() {
        return ad_sarea;
    }

    public void setAd_sarea(String ad_sarea) {
        this.ad_sarea = ad_sarea;
    }

    public Date getBeginDate() {
        return beginDate;
    }

    public void setBeginDate(Date beginDate) {
        this.beginDate = beginDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public Integer getAd_stime() {
        return ad_stime;
    }

    public void setAd_stime(Integer ad_stime) {
        this.ad_stime = ad_stime;
    }

    public Integer getAd_etime() {
        return ad_etime;
    }

    public void setAd_etime(Integer ad_etime) {
        this.ad_etime = ad_etime;
    }

    public String getAd_opentype() {
        return ad_opentype;
    }

    public void setAd_opentype(String ad_opentype) {
        this.ad_opentype = ad_opentype;
    }

    public String getAd_title() {
        return ad_title;
    }

    public void setAd_title(String ad_title) {
        this.ad_title = ad_title;
    }

    public String getAd_pic() {
        return ad_pic;
    }

    public void setAd_pic(String ad_pic) {
        this.ad_pic = ad_pic;
    }

    public String getAd_content() {
        return ad_content;
    }

    public void setAd_content(String ad_content) {
        this.ad_content = ad_content;
    }

    public String getAd_url() {
        return ad_url;
    }

    public void setAd_url(String ad_url) {
        this.ad_url = ad_url;
    }

    public Integer getAd_order() {
        return ad_order;
    }

    public void setAd_order(Integer ad_order) {
        this.ad_order = ad_order;
    }

    public String getAd_price() {
        return ad_price;
    }

    public void setAd_price(String ad_price) {
        this.ad_price = ad_price;
    }
}
