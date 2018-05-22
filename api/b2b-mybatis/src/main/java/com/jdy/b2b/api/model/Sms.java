package com.jdy.b2b.api.model;

import java.util.Date;

public class Sms {
    private Long id;

    private Long sCompanyId;

    private String sCompanyName;

    private Long sOrderId;

    private Long sTempId;

    private String sTel;

    private String sSms;

    private String sReason;

    private Integer sStatus;

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

    public Long getsCompanyId() {
        return sCompanyId;
    }

    public void setsCompanyId(Long sCompanyId) {
        this.sCompanyId = sCompanyId;
    }

    public String getsCompanyName() {
        return sCompanyName;
    }

    public void setsCompanyName(String sCompanyName) {
        this.sCompanyName = sCompanyName == null ? null : sCompanyName.trim();
    }

    public Long getsOrderId() {
        return sOrderId;
    }

    public void setsOrderId(Long sOrderId) {
        this.sOrderId = sOrderId;
    }

    public Long getsTempId() {
        return sTempId;
    }

    public void setsTempId(Long sTempId) {
        this.sTempId = sTempId;
    }

    public String getsTel() {
        return sTel;
    }

    public void setsTel(String sTel) {
        this.sTel = sTel == null ? null : sTel.trim();
    }

    public String getsSms() {
        return sSms;
    }

    public void setsSms(String sSms) {
        this.sSms = sSms == null ? null : sSms.trim();
    }

    public String getsReason() {
        return sReason;
    }

    public void setsReason(String sReason) {
        this.sReason = sReason == null ? null : sReason.trim();
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
}