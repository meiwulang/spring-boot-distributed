package com.jdy.b2b.api.vo.scenicspot;

import com.jdy.b2b.api.common.BaseVO;

import java.util.Date;

/**
 * Created by yangcheng on 2017/7/7.
 */
public class ScenicSaveOrUpdateVo extends BaseVO{
    private Long id;

    private String sCustomPlace;

    private Long companyId;

    private String sName;

    private String sSortName;

    private String sPym;

    private Long sSort;

    private String sPhone;

    private Integer sAttribute;

    private String sCountry;

    private String sProvince;

    private String sCity;

    private String sArea;

    private String sAdress;

    private String sAdditional;

    private Date sStartTime;
    private Date sEndTime;

    private String sLevel;

    private String sIntroduce;

    private String sMapx;

    private String sMapy;

    private Integer sStatus;

    private Date createTime;

    private Long createUser;

    private Date updateTime;

    private Long updateUser;

    private String sDetail;

    public String getsCustomPlace() {
        return sCustomPlace;
    }

    public void setsCustomPlace(String sCustomPlace) {
        this.sCustomPlace = sCustomPlace;
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

    public String getsName() {
        return sName;
    }

    public void setsName(String sName) {
        this.sName = sName == null ? null : sName.trim();
    }

    public String getsSortName() {
        return sSortName;
    }

    public void setsSortName(String sSortName) {
        this.sSortName = sSortName == null ? null : sSortName.trim();
    }

    public String getsPym() {
        return sPym;
    }

    public void setsPym(String sPym) {
        this.sPym = sPym == null ? null : sPym.trim();
    }

    public Long getsSort() {
        return sSort;
    }

    public void setsSort(Long sSort) {
        this.sSort = sSort;
    }

    public String getsPhone() {
        return sPhone;
    }

    public void setsPhone(String sPhone) {
        this.sPhone = sPhone == null ? null : sPhone.trim();
    }

    public Integer getsAttribute() {
        return sAttribute;
    }

    public void setsAttribute(Integer sAttribute) {
        this.sAttribute = sAttribute;
    }

    public String getsCountry() {
        return sCountry;
    }

    public void setsCountry(String sCountry) {
        this.sCountry = sCountry == null ? null : sCountry.trim();
    }

    public String getsProvince() {
        return sProvince;
    }

    public void setsProvince(String sProvince) {
        this.sProvince = sProvince == null ? null : sProvince.trim();
    }

    public String getsCity() {
        return sCity;
    }

    public void setsCity(String sCity) {
        this.sCity = sCity == null ? null : sCity.trim();
    }

    public String getsArea() {
        return sArea;
    }

    public void setsArea(String sArea) {
        this.sArea = sArea == null ? null : sArea.trim();
    }

    public String getsAdress() {
        return sAdress;
    }

    public void setsAdress(String sAdress) {
        this.sAdress = sAdress == null ? null : sAdress.trim();
    }

    public String getsAdditional() {
        return sAdditional;
    }

    public void setsAdditional(String sAdditional) {
        this.sAdditional = sAdditional == null ? null : sAdditional.trim();
    }

    public Date getsStartTime() {
        return sStartTime;
    }

    public void setsStartTime(Date sStartTime) {
        this.sStartTime = sStartTime;
    }

    public Date getsEndTime() {
        return sEndTime;
    }

    public void setsEndTime(Date sEndTime) {
        this.sEndTime = sEndTime;
    }

    public String getsLevel() {
        return sLevel;
    }

    public void setsLevel(String sLevel) {
        this.sLevel = sLevel;
    }

    public String getsIntroduce() {
        return sIntroduce;
    }

    public void setsIntroduce(String sIntroduce) {
        this.sIntroduce = sIntroduce == null ? null : sIntroduce.trim();
    }

    public String getsMapx() {
        return sMapx;
    }

    public void setsMapx(String sMapx) {
        this.sMapx = sMapx == null ? null : sMapx.trim();
    }

    public String getsMapy() {
        return sMapy;
    }

    public void setsMapy(String sMapy) {
        this.sMapy = sMapy == null ? null : sMapy.trim();
    }

    public Integer getsStatus() {
        return sStatus;
    }

    public void setsStatus(Integer sStatus) {
        this.sStatus = sStatus;
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

    public String getsDetail() {
        return sDetail;
    }

    public void setsDetail(String sDetail) {
        this.sDetail = sDetail == null ? null : sDetail.trim();
    }
}
