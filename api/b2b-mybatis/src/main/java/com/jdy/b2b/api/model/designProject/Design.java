package com.jdy.b2b.api.model.designProject;

import java.util.Date;

public class Design {
    private Long id;

    private Long lastRId;

    private Long lastPId;

    private Long createUser;

    private Date createTime;

    private Date answerTime;

    private Long managerId;

    private Integer dStatus;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getLastRId() {
        return lastRId;
    }

    public void setLastRId(Long lastRId) {
        this.lastRId = lastRId;
    }

    public Long getLastPId() {
        return lastPId;
    }

    public void setLastPId(Long lastPId) {
        this.lastPId = lastPId;
    }

    public Long getCreateUser() {
        return createUser;
    }

    public void setCreateUser(Long createUser) {
        this.createUser = createUser;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Date getAnswerTime() {
        return answerTime;
    }

    public void setAnswerTime(Date answerTime) {
        this.answerTime = answerTime;
    }

    public Long getManagerId() {
        return managerId;
    }

    public void setManagerId(Long managerId) {
        this.managerId = managerId;
    }

    public Integer getdStatus() {
        return dStatus;
    }

    public void setdStatus(Integer dStatus) {
        this.dStatus = dStatus;
    }
}