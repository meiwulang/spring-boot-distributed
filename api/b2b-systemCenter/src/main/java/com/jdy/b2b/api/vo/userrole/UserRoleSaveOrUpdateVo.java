package com.jdy.b2b.api.vo.userrole;


import com.jdy.b2b.api.common.BaseVO;

import java.util.Date;

/**
 * Created by yangcheng on 2017/7/4.
 */
public class UserRoleSaveOrUpdateVo extends BaseVO {
    private Long id;

    private Long urCompanyId;

    private String urRoleName;

    private String urRoleNo;

    private String urRemark;

    private Integer urStatus;

    private Integer urSort;

    private Date createTime;

    private Long createUser;

    private Date updateTime;

    private Long updateUser;

    private String urRoleContent;

    private String urRoleContentArray;

    public String getUrRoleContentArray() {
        return urRoleContentArray;
    }

    public void setUrRoleContentArray(String urRoleContentArray) {
        this.urRoleContentArray = urRoleContentArray;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUrCompanyId() {
        return urCompanyId;
    }

    public void setUrCompanyId(Long urCompanyId) {
        this.urCompanyId = urCompanyId;
    }

    public String getUrRoleName() {
        return urRoleName;
    }

    public void setUrRoleName(String urRoleName) {
        this.urRoleName = urRoleName;
    }

    public String getUrRoleNo() {
        return urRoleNo;
    }

    public void setUrRoleNo(String urRoleNo) {
        this.urRoleNo = urRoleNo;
    }

    public String getUrRemark() {
        return urRemark;
    }

    public void setUrRemark(String urRemark) {
        this.urRemark = urRemark;
    }

    public Integer getUrStatus() {
        return urStatus;
    }

    public void setUrStatus(Integer urStatus) {
        this.urStatus = urStatus;
    }

    public Integer getUrSort() {
        return urSort;
    }

    public void setUrSort(Integer urSort) {
        this.urSort = urSort;
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

    public String getUrRoleContent() {
        return urRoleContent;
    }

    public void setUrRoleContent(String urRoleContent) {
        this.urRoleContent = urRoleContent;
    }
}
