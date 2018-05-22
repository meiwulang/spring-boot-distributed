package com.jdy.b2b.api.model.label;

import com.jdy.b2b.api.model.product.BaseDO;

import java.util.Date;

public class Label{
    private Long id;

    private Long companyId;

    private String lName;

    private Long lGroupId;

    private Long lModuleId;

    private Integer lSort;

    private String lColor;

    private Integer lStatus;

    private Date createTime;

    private Long createUser;

    private Date updateTime;

    private Long updateUser;

    public Long getlModuleId() {
        return lModuleId;
    }

    public void setlModuleId(Long lModuleId) {
        this.lModuleId = lModuleId;
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

    public String getlName() {
        return lName;
    }

    public void setlName(String lName) {
        this.lName = lName == null ? null : lName.trim();
    }

    public Long getlGroupId() {
        return lGroupId;
    }

    public void setlGroupId(Long lGroupId) {
        this.lGroupId = lGroupId;
    }

    public Integer getlSort() {
        return lSort;
    }

    public void setlSort(Integer lSort) {
        this.lSort = lSort;
    }

    public String getlColor() {
        return lColor;
    }

    public void setlColor(String lColor) {
        this.lColor = lColor == null ? null : lColor.trim();
    }

    public Integer getlStatus() {
        return lStatus;
    }

    public void setlStatus(Integer lStatus) {
        this.lStatus = lStatus;
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