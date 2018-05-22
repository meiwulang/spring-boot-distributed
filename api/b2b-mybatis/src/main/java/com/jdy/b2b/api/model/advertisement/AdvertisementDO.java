package com.jdy.b2b.api.model.advertisement;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class AdvertisementDO {
    private Long attachId;
    private String attachUrl;
    private Long id;
    private Long companyId;
    private Integer aPlace;

    private Date aStartTime;

    private Date aEndTime;

    private String aTitle;

    private String aLink;

    private String aOther;

    private String aComment;

    private Integer aOpenType;

    private Integer aSort;

    private Integer aShow;

    private Integer aStatus;

    private Date createTime;

    private Long createUser;

    private Date updateTime;

    private Long updateUser;



    /*保存投放城市集合*/
    private List<AdverArea> areaList = new ArrayList<AdverArea>();

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public Integer getaShow() {
        return aShow;
    }

    public void setaShow(Integer aShow) {
        this.aShow = aShow;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getaPlace() {
        return aPlace;
    }

    public void setaPlace(Integer aPlace) {
        this.aPlace = aPlace;
    }

    public Date getaStartTime() {
        return aStartTime;
    }

    public void setaStartTime(Date aStartTime) {
        this.aStartTime = aStartTime;
    }

    public Date getaEndTime() {
        return aEndTime;
    }

    public void setaEndTime(Date aEndTime) {
        this.aEndTime = aEndTime;
    }

    public String getaTitle() {
        return aTitle;
    }

    public void setaTitle(String aTitle) {
        this.aTitle = aTitle;
    }

    public String getaLink() {
        return aLink;
    }

    public void setaLink(String aLink) {
        this.aLink = aLink;
    }

    public String getaOther() {
        return aOther;
    }

    public void setaOther(String aOther) {
        this.aOther = aOther;
    }

    public String getaComment() {
        return aComment;
    }

    public void setaComment(String aComment) {
        this.aComment = aComment;
    }

    public Integer getaOpenType() {
        return aOpenType;
    }

    public void setaOpenType(Integer aOpenType) {
        this.aOpenType = aOpenType;
    }

    public Integer getaSort() {
        return aSort;
    }

    public void setaSort(Integer aSort) {
        this.aSort = aSort;
    }

    public Integer getaStatus() {
        return aStatus;
    }

    public void setaStatus(Integer aStatus) {
        this.aStatus = aStatus;
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

    public List<AdverArea> getAreaList() {
        return areaList;
    }

    public void setAreaList(List<AdverArea> areaList) {
        this.areaList = areaList;
    }

    public Long getAttachId() {
        return attachId;
    }

    public void setAttachId(Long attachId) {
        this.attachId = attachId;
    }

    public String getAttachUrl() {
        return attachUrl;
    }

    public void setAttachUrl(String attachUrl) {
        this.attachUrl = attachUrl;
    }
}