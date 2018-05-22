package com.jdy.b2b.api.model;

import java.math.BigDecimal;
import java.util.Date;

public class Activity {
    private Long id;

    private Long aCompanyId;

    private String aActivityName;

    private String aBrandName;

    private Integer aActivityType;

    private BigDecimal aAmount;

    private BigDecimal aLimitAmount;

    private Integer aPayMethod;

    private Integer aTicketType;

    private Date aStartTime;

    private Date aEndTime;

    private Date aScheduleStart;

    private Date aScheduleEnd;

    private Integer aSort;

    private Integer aStatus;

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

    public Long getaCompanyId() {
        return aCompanyId;
    }

    public void setaCompanyId(Long aCompanyId) {
        this.aCompanyId = aCompanyId;
    }

    public String getaActivityName() {
        return aActivityName;
    }

    public void setaActivityName(String aActivityName) {
        this.aActivityName = aActivityName == null ? null : aActivityName.trim();
    }

    public String getaBrandName() {
        return aBrandName;
    }

    public void setaBrandName(String aBrandName) {
        this.aBrandName = aBrandName == null ? null : aBrandName.trim();
    }

    public Integer getaActivityType() {
        return aActivityType;
    }

    public void setaActivityType(Integer aActivityType) {
        this.aActivityType = aActivityType;
    }

    public BigDecimal getaAmount() {
        return aAmount;
    }

    public void setaAmount(BigDecimal aAmount) {
        this.aAmount = aAmount;
    }

    public BigDecimal getaLimitAmount() {
        return aLimitAmount;
    }

    public void setaLimitAmount(BigDecimal aLimitAmount) {
        this.aLimitAmount = aLimitAmount;
    }

    public Integer getaPayMethod() {
        return aPayMethod;
    }

    public void setaPayMethod(Integer aPayMethod) {
        this.aPayMethod = aPayMethod;
    }

    public Integer getaTicketType() {
        return aTicketType;
    }

    public void setaTicketType(Integer aTicketType) {
        this.aTicketType = aTicketType;
    }

    public Date getaStartTime() {
        return aStartTime;
    }

    public void setaStartTime(Date aStartTime) {
        this.aStartTime = aStartTime;
    }

    public Date getaEndTime() {
        return aEndTime;
    }

    public void setaEndTime(Date aEndTime) {
        this.aEndTime = aEndTime;
    }

    public Date getaScheduleStart() {
        return aScheduleStart;
    }

    public void setaScheduleStart(Date aScheduleStart) {
        this.aScheduleStart = aScheduleStart;
    }

    public Date getaScheduleEnd() {
        return aScheduleEnd;
    }

    public void setaScheduleEnd(Date aScheduleEnd) {
        this.aScheduleEnd = aScheduleEnd;
    }

    public Integer getaSort() {
        return aSort;
    }

    public void setaSort(Integer aSort) {
        this.aSort = aSort;
    }

    public Integer getaStatus() {
        return aStatus;
    }

    public void setaStatus(Integer aStatus) {
        this.aStatus = aStatus;
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