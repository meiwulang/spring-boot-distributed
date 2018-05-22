package com.jdy.b2b.api.model;

import com.jdy.b2b.api.common.BaseVO;

import java.util.Date;

public class BusHold extends BaseVO{
    private Long id;

    private Long bBusId;

    private Long bCompanyId;

    private String bAccount;

    private Integer bHoldHours;

    private String bSeat;

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

    public Long getbBusId() {
        return bBusId;
    }

    public void setbBusId(Long bBusId) {
        this.bBusId = bBusId;
    }

    public Long getbCompanyId() {
        return bCompanyId;
    }

    public void setbCompanyId(Long bCompanyId) {
        this.bCompanyId = bCompanyId;
    }

    public String getbAccount() {
        return bAccount;
    }

    public void setbAccount(String bAccount) {
        this.bAccount = bAccount == null ? null : bAccount.trim();
    }

    public Integer getbHoldHours() {
        return bHoldHours;
    }

    public void setbHoldHours(Integer bHoldHours) {
        this.bHoldHours = bHoldHours;
    }

    public String getbSeat() {
        return bSeat;
    }

    public void setbSeat(String bSeat) {
        this.bSeat = bSeat;
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