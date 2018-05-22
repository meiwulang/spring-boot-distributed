package com.jdy.b2b.api.model.roleModule;

import java.util.Date;

/**
 * Created by strict on 2017/11/16.
 */
public class RoleModule {
    private Long id;
    private Long rmRoleId;
    private Long rmModuleId;
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

    public Long getRmRoleId() {
        return rmRoleId;
    }

    public void setRmRoleId(Long rmRoleId) {
        this.rmRoleId = rmRoleId;
    }

    public Long getRmModuleId() {
        return rmModuleId;
    }

    public void setRmModuleId(Long rmModuleId) {
        this.rmModuleId = rmModuleId;
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
