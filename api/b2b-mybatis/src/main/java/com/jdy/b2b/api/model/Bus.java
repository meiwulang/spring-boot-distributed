package com.jdy.b2b.api.model;

import com.jdy.b2b.api.common.BaseVO;

import java.util.Date;

public class Bus extends BaseVO{
    private Long id;

    private Integer bNo;

    private Long bScheduleId;

    private Integer bSeatsNum;

    private String bSeatsLock;

    private Integer bStatus;

    private Date createTime;

    private Long createUser;

    private Date updateTime;

    private Long updateUser;

    public Bus() {
    }

    public Bus(Long id) {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getbNo() {
        return bNo;
    }

    public void setbNo(Integer bNo) {
        this.bNo = bNo;
    }

    public Long getbScheduleId() {
        return bScheduleId;
    }

    public void setbScheduleId(Long bScheduleId) {
        this.bScheduleId = bScheduleId;
    }

    public Integer getbSeatsNum() {
        return bSeatsNum;
    }

    public void setbSeatsNum(Integer bSeatsNum) {
        this.bSeatsNum = bSeatsNum;
    }

    public String getbSeatsLock() {
        return bSeatsLock;
    }

    public void setbSeatsLock(String bSeatsLock) {
        this.bSeatsLock = bSeatsLock == null ? null : bSeatsLock.trim();
    }

    public Integer getbStatus() {
        return bStatus;
    }

    public void setbStatus(Integer bStatus) {
        this.bStatus = bStatus;
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