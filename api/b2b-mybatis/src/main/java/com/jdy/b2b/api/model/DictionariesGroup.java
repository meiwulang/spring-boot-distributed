package com.jdy.b2b.api.model;
import com.jdy.b2b.api.common.BaseVO;

import java.util.Date;

public class DictionariesGroup extends BaseVO{
    private Long id;

    private String dgName;

    private Integer dgLevel;

    private Integer dgSort;

    private Integer dgStatus;

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

    public String getDgName() {
        return dgName;
    }

    public void setDgName(String dgName) {
        this.dgName = dgName == null ? null : dgName.trim();
    }

    public Integer getDgLevel() {
        return dgLevel;
    }

    public void setDgLevel(Integer dgLevel) {
        this.dgLevel = dgLevel;
    }

    public Integer getDgSort() {
        return dgSort;
    }

    public void setDgSort(Integer dgSort) {
        this.dgSort = dgSort;
    }

    public Integer getDgStatus() {
        return dgStatus;
    }

    public void setDgStatus(Integer dgStatus) {
        this.dgStatus = dgStatus;
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