package com.jdy.b2b.api.model.userrole;

import java.util.Date;

public class UserRole {
    private Long id;


    private Long urRoleId;

    private Long urUserId;

    private String urRoleName;


    private String urRemark;

    private Integer urSort;

    private Date createTime;

    private Long createUser;

    private Date updateTime;

    private Long updateUser;

    private Integer urStatus;
	
	private String urRoleContent;

    private String urRoleContentArray;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }



    public Long getUrRoleId() {
        return urRoleId;
    }

    public void setUrRoleId(Long urRoleId) {
        this.urRoleId = urRoleId;
    }

    public Long getUrUserId() {
        return urUserId;
    }

    public void setUrUserId(Long urUserId) {
        this.urUserId = urUserId;
    }

    public String getUrRoleName() {
        return urRoleName;
    }

    public void setUrRoleName(String urRoleName) {
        this.urRoleName = urRoleName == null ? null : urRoleName.trim();
    }



    public String getUrRemark() {
        return urRemark;
    }

    public void setUrRemark(String urRemark) {
        this.urRemark = urRemark == null ? null : urRemark.trim();
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

    public Integer getUrStatus() {
        return urStatus;
    }

    public void setUrStatus(Integer urStatus) {
        this.urStatus = urStatus;
    }
	
	public String getUrRoleContent() {
        return urRoleContent;
    }

    public void setUrRoleContent(String urRoleContent) {
        this.urRoleContent = urRoleContent == null ? null : urRoleContent.trim();
    }

    public String getUrRoleContentArray() {
        return urRoleContentArray;
    }

    public void setUrRoleContentArray(String urRoleContentArray) {
        this.urRoleContentArray = urRoleContentArray == null ? null : urRoleContentArray.trim();
    }
}