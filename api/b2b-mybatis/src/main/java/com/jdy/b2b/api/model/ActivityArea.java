package com.jdy.b2b.api.model;

import java.util.Date;

public class ActivityArea {
    private Long id;

    private Long aaActivityId;

    private String aaCountry;

    private String aaProvince;

    private String aaCity;

    private String aaArea;

    private Boolean aaRecommend;

    private Date createTime;

    private Long createUser;

    private Date updateTime;

    private Long updateUser;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAaActivityId() {
        return aaActivityId;
    }

    public void setAaActivityId(Long aaActivityId) {
        this.aaActivityId = aaActivityId;
    }

    public String getAaCountry() {
        return aaCountry;
    }

    public void setAaCountry(String aaCountry) {
        this.aaCountry = aaCountry == null ? null : aaCountry.trim();
    }

    public String getAaProvince() {
        return aaProvince;
    }

    public void setAaProvince(String aaProvince) {
        this.aaProvince = aaProvince == null ? null : aaProvince.trim();
    }

    public String getAaCity() {
        return aaCity;
    }

    public void setAaCity(String aaCity) {
        this.aaCity = aaCity == null ? null : aaCity.trim();
    }

    public String getAaArea() {
        return aaArea;
    }

    public void setAaArea(String aaArea) {
        this.aaArea = aaArea == null ? null : aaArea.trim();
    }

    public Boolean getAaRecommend() {
        return aaRecommend;
    }

    public void setAaRecommend(Boolean aaRecommend) {
        this.aaRecommend = aaRecommend;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Long getCreateUser() {
        return createUser;
    }

    public void setCreateUser(Long createUser) {
        this.createUser = createUser;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public Long getUpdateUser() {
        return updateUser;
    }

    public void setUpdateUser(Long updateUser) {
        this.updateUser = updateUser;
    }
}