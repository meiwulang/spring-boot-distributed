package com.jdy.b2b.web.pojo.advertisement;


import java.util.Date;

public class Advertisement{
    private Long id;

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
        this.aTitle = aTitle == null ? null : aTitle.trim();
    }

    public String getaLink() {
        return aLink;
    }

    public void setaLink(String aLink) {
        this.aLink = aLink == null ? null : aLink.trim();
    }

    public String getaOther() {
        return aOther;
    }

    public void setaOther(String aOther) {
        this.aOther = aOther == null ? null : aOther.trim();
    }

    public String getaComment() {
        return aComment;
    }

    public void setaComment(String aComment) {
        this.aComment = aComment == null ? null : aComment.trim();
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
}