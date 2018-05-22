package com.jdy.b2b.api.model.ticketset;

import java.util.Date;

public class TicketSet{
    private Long id;

    private Long tsSetId;

    private Long tsSingleId;

    private Integer tsSeats;

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

    public Long getTsSetId() {
        return tsSetId;
    }

    public void setTsSetId(Long tsSetId) {
        this.tsSetId = tsSetId;
    }

    public Long getTsSingleId() {
        return tsSingleId;
    }

    public void setTsSingleId(Long tsSingleId) {
        this.tsSingleId = tsSingleId;
    }

    public Integer getTsSeats() {
        return tsSeats;
    }

    public void setTsSeats(Integer tsSeats) {
        this.tsSeats = tsSeats;
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