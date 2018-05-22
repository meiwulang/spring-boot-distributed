package com.jdy.b2b.api.model;

import java.util.Date;

public class BusiLogs {
    private Long id;

    private String blCompany;

    private String blUsername;

    private String blAccount;

    private String blDescription;

    private String blModule;

    private Long blPid;

    private String blMethod;

    private String blDomain;

    private String blIp;

    private String blBrowser;

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

    public String getBlCompany() {
        return blCompany;
    }

    public void setBlCompany(String blCompany) {
        this.blCompany = blCompany == null ? null : blCompany.trim();
    }

    public String getBlUsername() {
        return blUsername;
    }

    public void setBlUsername(String blUsername) {
        this.blUsername = blUsername == null ? null : blUsername.trim();
    }

    public String getBlAccount() {
        return blAccount;
    }

    public void setBlAccount(String blAccount) {
        this.blAccount = blAccount == null ? null : blAccount.trim();
    }

    public String getBlDescription() {
        return blDescription;
    }

    public void setBlDescription(String blDescription) {
        this.blDescription = blDescription == null ? null : blDescription.trim();
    }

    public String getBlModule() {
        return blModule;
    }

    public void setBlModule(String blModule) {
        this.blModule = blModule == null ? null : blModule.trim();
    }

    public Long getBlPid() {
        return blPid;
    }

    public void setBlPid(Long blPid) {
        this.blPid = blPid;
    }

    public String getBlMethod() {
        return blMethod;
    }

    public void setBlMethod(String blMethod) {
        this.blMethod = blMethod == null ? null : blMethod.trim();
    }

    public String getBlDomain() {
        return blDomain;
    }

    public void setBlDomain(String blDomain) {
        this.blDomain = blDomain == null ? null : blDomain.trim();
    }

    public String getBlIp() {
        return blIp;
    }

    public void setBlIp(String blIp) {
        this.blIp = blIp == null ? null : blIp.trim();
    }

    public String getBlBrowser() {
        return blBrowser;
    }

    public void setBlBrowser(String blBrowser) {
        this.blBrowser = blBrowser == null ? null : blBrowser.trim();
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