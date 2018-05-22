package com.jdy.b2b.api.model.marketArea;

import java.util.Date;

public class MarketArea {
    private Long id;

    private Long maCompanyId;

    private String maProvince;

    private String maCity;

    private Date createTime;

    private Long createUser;

    private Date updateTime;

    private Long updateUser;

    public MarketArea() {
    }

    public MarketArea(Long maCompanyId, String maCity) {
        this.maCompanyId = maCompanyId;
        this.maCity = maCity;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMaCompanyId() {
        return maCompanyId;
    }

    public void setMaCompanyId(Long maCompanyId) {
        this.maCompanyId = maCompanyId;
    }

    public String getMaProvince() {
        return maProvince;
    }

    public void setMaProvince(String maProvince) {
        this.maProvince = maProvince == null ? null : maProvince.trim();
    }

    public String getMaCity() {
        return maCity;
    }

    public void setMaCity(String maCity) {
        this.maCity = maCity == null ? null : maCity.trim();
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