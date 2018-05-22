package com.jdy.b2b.api.model;

import java.util.Date;

public class ActivityProduct {
    private Long id;

    private Long apActivityId;

    private Long apProductId;

    private Boolean apRecommend;

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

    public Long getApActivityId() {
        return apActivityId;
    }

    public void setApActivityId(Long apActivityId) {
        this.apActivityId = apActivityId;
    }

    public Long getApProductId() {
        return apProductId;
    }

    public void setApProductId(Long apProductId) {
        this.apProductId = apProductId;
    }

    public Boolean getApRecommend() {
        return apRecommend;
    }

    public void setApRecommend(Boolean apRecommend) {
        this.apRecommend = apRecommend;
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