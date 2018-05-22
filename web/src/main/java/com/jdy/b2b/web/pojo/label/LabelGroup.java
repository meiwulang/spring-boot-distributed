package com.jdy.b2b.web.pojo.label;

import java.util.Date;

public class LabelGroup{
    private Long id;

    private Long companyId;

    private String lgName;

    private Long lgPid;

    private Integer lgStatus;

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

    public String getLgName() {
        return lgName;
    }

    public void setLgName(String lgName) {
        this.lgName = lgName == null ? null : lgName.trim();
    }

    public Long getLgPid() {
        return lgPid;
    }

    public void setLgPid(Long lgPid) {
        this.lgPid = lgPid;
    }

    public Integer getLgStatus() {
        return lgStatus;
    }

    public void setLgStatus(Integer lgStatus) {
        this.lgStatus = lgStatus;
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