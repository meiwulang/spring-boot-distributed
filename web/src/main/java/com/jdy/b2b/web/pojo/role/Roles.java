package com.jdy.b2b.web.pojo.role;


import com.jdy.b2b.web.util.BaseVO;

import java.util.Date;

/**
 * Created by strict on 2017/11/16.
 */
public class Roles extends BaseVO {

    private Long id;

    private Long rCompanyId;

    private String rRoleName;

    private String rRoleNo;

    private String rRemark;

    private Long rSort;

    private Integer rType;

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

    public Long getrCompanyId() {
        return rCompanyId;
    }

    public void setrCompanyId(Long rCompanyId) {
        this.rCompanyId = rCompanyId;
    }

    public String getrRoleName() {
        return rRoleName;
    }

    public void setrRoleName(String rRoleName) {
        this.rRoleName = rRoleName;
    }

    public String getrRoleNo() {
        return rRoleNo;
    }

    public void setrRoleNo(String rRoleNo) {
        this.rRoleNo = rRoleNo;
    }

    public String getrRemark() {
        return rRemark;
    }

    public void setrRemark(String rRemark) {
        this.rRemark = rRemark;
    }

    public Long getrSort() {
        return rSort;
    }

    public void setrSort(Long rSort) {
        this.rSort = rSort;
    }

    public Integer getrType() {
        return rType;
    }

    public void setrType(Integer rType) {
        this.rType = rType;
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
