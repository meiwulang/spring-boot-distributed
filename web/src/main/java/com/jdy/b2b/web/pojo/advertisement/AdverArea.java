package com.jdy.b2b.web.pojo.advertisement;


import java.util.Date;

public class AdverArea{
    private Long id;
    private Long aaAdverId;
    private String taCountry;
    private String taProvince;
    private String taCity;
    private String taArea;

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

    public Long getAaAdverId() {
        return aaAdverId;
    }

    public void setAaAdverId(Long aaAdverId) {
        this.aaAdverId = aaAdverId;
    }

    public String getTaCountry() {
        return taCountry;
    }

    public void setTaCountry(String taCountry) {
        this.taCountry = taCountry == null ? null : taCountry.trim();
    }

    public String getTaProvince() {
        return taProvince;
    }

    public void setTaProvince(String taProvince) {
        this.taProvince = taProvince == null ? null : taProvince.trim();
    }

    public String getTaCity() {
        return taCity;
    }

    public void setTaCity(String taCity) {
        this.taCity = taCity == null ? null : taCity.trim();
    }

    public String getTaArea() {
        return taArea;
    }

    public void setTaArea(String taArea) {
        this.taArea = taArea == null ? null : taArea.trim();
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