package com.jdy.b2b.api.model.module;


import java.util.Date;

public class Module {
    private Integer id;

    private String mName;

    private String mImg;

    private String mEnName;

    private String mOperation;

    private Integer mType;

    private Integer mPid;

    private String mUrl;

    private Integer mMode;

    private Integer mSort;

    private Integer mStatus;

    private Date createTime;

    private Long createUser;

    private Date updateTime;

    private Long updateUser;

    public String getmImg() {
        return mImg;
    }

    public void setmImg(String mImg) {
        this.mImg = mImg;
    }

    public String getmUrl() {
        return mUrl;
    }

    public void setmUrl(String mUrl) {
        this.mUrl = mUrl;
    }

    public Integer getmMode() {
        return mMode;
    }

    public void setmMode(Integer mMode) {
        this.mMode = mMode;
    }

    public String getmOperation() {
        return mOperation;
    }

    public void setmOperation(String mOperation) {
        this.mOperation = mOperation;
    }

    public Integer getmSort() {
        return mSort;
    }

    public void setmSort(Integer mSort) {
        this.mSort = mSort;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getmName() {
        return mName;
    }

    public void setmName(String mName) {
        this.mName = mName == null ? null : mName.trim();
    }

    public String getmEnName() {
        return mEnName;
    }

    public void setmEnName(String mEnName) {
        this.mEnName = mEnName == null ? null : mEnName.trim();
    }

    public Integer getmType() {
        return mType;
    }

    public void setmType(Integer mType) {
        this.mType = mType;
    }

    public Integer getmPid() {
        return mPid;
    }

    public void setmPid(Integer mPid) {
        this.mPid = mPid;
    }

    public Integer getmStatus() {
        return mStatus;
    }

    public void setmStatus(Integer mStatus) {
        this.mStatus = mStatus;
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

    @Override
    public String toString() {
        return "Module{" +
                "id=" + id +
                ", mName='" + mName + '\'' +
                '}';
    }
}