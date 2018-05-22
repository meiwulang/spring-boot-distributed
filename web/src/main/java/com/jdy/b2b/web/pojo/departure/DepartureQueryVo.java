package com.jdy.b2b.web.pojo.departure;


import java.util.Date;

public class DepartureQueryVo {
    private Long id;

    private Long companyId;

    private String dName;

    private Integer dType;

    private Integer dTraffic;

    private String dThree;

    private String dCountry;

    private String dProvince;

    private String dCity;

    private String dArea;

    private String dMapx;

    private String dMapy;

    private Integer dStatus;

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

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getdName() {
        return dName;
    }

    public void setdName(String dName) {
        this.dName = dName == null ? null : dName.trim();
    }

    public Integer getdType() {
        return dType;
    }

    public void setdType(Integer dType) {
        this.dType = dType;
    }

    public Integer getdTraffic() {
        return dTraffic;
    }

    public void setdTraffic(Integer dTraffic) {
        this.dTraffic = dTraffic;
    }

    public String getdThree() {
        return dThree;
    }

    public void setdThree(String dThree) {
        this.dThree = dThree == null ? null : dThree.trim();
    }

    public String getdCountry() {
        return dCountry;
    }

    public void setdCountry(String dCountry) {
        this.dCountry = dCountry == null ? null : dCountry.trim();
    }

    public String getdProvince() {
        return dProvince;
    }

    public void setdProvince(String dProvince) {
        this.dProvince = dProvince == null ? null : dProvince.trim();
    }

    public String getdCity() {
        return dCity;
    }

    public void setdCity(String dCity) {
        this.dCity = dCity == null ? null : dCity.trim();
    }

    public String getdArea() {
        return dArea;
    }

    public void setdArea(String dArea) {
        this.dArea = dArea == null ? null : dArea.trim();
    }

    public String getdMapx() {
        return dMapx;
    }

    public void setdMapx(String dMapx) {
        this.dMapx = dMapx == null ? null : dMapx.trim();
    }

    public String getdMapy() {
        return dMapy;
    }

    public void setdMapy(String dMapy) {
        this.dMapy = dMapy == null ? null : dMapy.trim();
    }

    public Integer getdStatus() {
        return dStatus;
    }

    public void setdStatus(Integer dStatus) {
        this.dStatus = dStatus;
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