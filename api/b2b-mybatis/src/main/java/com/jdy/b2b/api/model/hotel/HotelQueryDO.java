package com.jdy.b2b.api.model.hotel;

import java.util.Date;

public class HotelQueryDO {
    private Long id;

    private Long companyId;

    private String hName;

    private String hShortName;

    private String hPym;

    private String hCountry;

    private String hProvince;

    private String hCity;

    private String hArea;

    private String hAdress;

    private String hAdditional;

    private String hLevel;

    private String hIntroduce;

    private String hMapx;

    private String hMapy;

    private Integer hStatus;

    private Date createTime;

    private Long createUser;

    private Date updateTime;

    private Long updateUser;

    private Long albumId;

    public Long getAlbumId() {
        return albumId;
    }

    public void setAlbumId(Long albumId) {
        this.albumId = albumId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String gethName() {
        return hName;
    }

    public void sethName(String hName) {
        this.hName = hName == null ? null : hName.trim();
    }

    public String gethShortName() {
        return hShortName;
    }

    public void sethShortName(String hShortName) {
        this.hShortName = hShortName == null ? null : hShortName.trim();
    }

    public String gethPym() {
        return hPym;
    }

    public void sethPym(String hPym) {
        this.hPym = hPym == null ? null : hPym.trim();
    }

    public String gethCountry() {
        return hCountry;
    }

    public void sethCountry(String hCountry) {
        this.hCountry = hCountry == null ? null : hCountry.trim();
    }

    public String gethProvince() {
        return hProvince;
    }

    public void sethProvince(String hProvince) {
        this.hProvince = hProvince == null ? null : hProvince.trim();
    }

    public String gethCity() {
        return hCity;
    }

    public void sethCity(String hCity) {
        this.hCity = hCity == null ? null : hCity.trim();
    }

    public String gethArea() {
        return hArea;
    }

    public void sethArea(String hArea) {
        this.hArea = hArea == null ? null : hArea.trim();
    }

    public String gethAdress() {
        return hAdress;
    }

    public void sethAdress(String hAdress) {
        this.hAdress = hAdress == null ? null : hAdress.trim();
    }

    public String gethAdditional() {
        return hAdditional;
    }

    public void sethAdditional(String hAdditional) {
        this.hAdditional = hAdditional == null ? null : hAdditional.trim();
    }

    public String gethLevel() {
        return hLevel;
    }

    public void sethLevel(String hLevel) {
        this.hLevel = hLevel == null ? null : hLevel.trim();
    }

    public String gethIntroduce() {
        return hIntroduce;
    }

    public void sethIntroduce(String hIntroduce) {
        this.hIntroduce = hIntroduce == null ? null : hIntroduce.trim();
    }

    public String gethMapx() {
        return hMapx;
    }

    public void sethMapx(String hMapx) {
        this.hMapx = hMapx == null ? null : hMapx.trim();
    }

    public String gethMapy() {
        return hMapy;
    }

    public void sethMapy(String hMapy) {
        this.hMapy = hMapy == null ? null : hMapy.trim();
    }

    public Integer gethStatus() {
        return hStatus;
    }

    public void sethStatus(Integer hStatus) {
        this.hStatus = hStatus;
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