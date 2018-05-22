package com.jdy.b2b.api.model;

import com.jdy.b2b.api.common.BaseVO;

import java.util.Date;

public class Schedule extends BaseVO{
    private Long id;

    private Long sProductId;

    private String sScheduleNo;

    private String sScheduleName;
    private String sGroupOrderNo;

    private Date sCalendar;

    private Date sReturnCalendar;

    private Integer sWeekDay;

    private Integer sCarNum;

    private Integer sCarSeats;

    private Date sLeaveTime;

    private Integer sStopSale;

    private Integer sStopType;

    private Integer sShamNum;

    private Boolean sPrint;

    private Integer sSitType;

    private Integer sGroupNum;

    private Integer sSeatHold;

    private Integer sSeatLock;

    private Integer sSeatSold;

    private Integer sSeatTotal;

    private Integer sStatus;

    private Date createTime;

    private Long createUser;

    private Date updateTime;

    private Long updateUser;

    private byte departureStatus;

    private String cancelComment;

    public String getCancelComment() {
        return cancelComment;
    }

    public void setCancelComment(String cancelComment) {
        this.cancelComment = cancelComment;
    }

    public byte getDepartureStatus() {
        return departureStatus;
    }

    public void setDepartureStatus(byte departureStatus) {
        this.departureStatus = departureStatus;
    }

    public Date getsReturnCalendar() {
        return sReturnCalendar;
    }

    public void setsReturnCalendar(Date sReturnCalendar) {
        this.sReturnCalendar = sReturnCalendar;
    }

    public String getsGroupOrderNo() {
        return sGroupOrderNo;
    }

    public void setsGroupOrderNo(String sGroupOrderNo) {
        this.sGroupOrderNo = sGroupOrderNo;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getsProductId() {
        return sProductId;
    }

    public void setsProductId(Long sProductId) {
        this.sProductId = sProductId;
    }

    public String getsScheduleNo() {
        return sScheduleNo;
    }

    public void setsScheduleNo(String sScheduleNo) {
        this.sScheduleNo = sScheduleNo == null ? null : sScheduleNo.trim();
    }

    public String getsScheduleName() {
        return sScheduleName;
    }

    public void setsScheduleName(String sScheduleName) {
        this.sScheduleName = sScheduleName == null ? null : sScheduleName.trim();
    }

    public Date getsCalendar() {
        return sCalendar;
    }

    public void setsCalendar(Date sCalendar) {
        this.sCalendar = sCalendar;
    }

    public Integer getsWeekDay() {
        return sWeekDay;
    }

    public void setsWeekDay(Integer sWeekDay) {
        this.sWeekDay = sWeekDay;
    }

    public Integer getsCarNum() {
        return sCarNum;
    }

    public void setsCarNum(Integer sCarNum) {
        this.sCarNum = sCarNum;
    }

    public Integer getsCarSeats() {
        return sCarSeats;
    }

    public void setsCarSeats(Integer sCarSeats) {
        this.sCarSeats = sCarSeats;
    }

    public Date getsLeaveTime() {
        return sLeaveTime;
    }

    public void setsLeaveTime(Date sLeaveTime) {
        this.sLeaveTime = sLeaveTime;
    }

    public Integer getsStopSale() {
        return sStopSale;
    }

    public void setsStopSale(Integer sStopSale) {
        this.sStopSale = sStopSale;
    }

    public Integer getsStopType() {
        return sStopType;
    }

    public void setsStopType(Integer sStopType) {
        this.sStopType = sStopType;
    }

    public Integer getsShamNum() {
        return sShamNum;
    }

    public void setsShamNum(Integer sShamNum) {
        this.sShamNum = sShamNum;
    }

    public Boolean getsPrint() {
        return sPrint;
    }

    public void setsPrint(Boolean sPrint) {
        this.sPrint = sPrint;
    }

    public Integer getsSitType() {
        return sSitType;
    }

    public void setsSitType(Integer sSitType) {
        this.sSitType = sSitType;
    }

    public Integer getsGroupNum() {
        return sGroupNum;
    }

    public void setsGroupNum(Integer sGroupNum) {
        this.sGroupNum = sGroupNum;
    }

    public Integer getsSeatHold() {
        return sSeatHold;
    }

    public void setsSeatHold(Integer sSeatHold) {
        this.sSeatHold = sSeatHold;
    }

    public Integer getsSeatLock() {
        return sSeatLock;
    }

    public void setsSeatLock(Integer sSeatLock) {
        this.sSeatLock = sSeatLock;
    }

    public Integer getsSeatSold() {
        return sSeatSold;
    }

    public void setsSeatSold(Integer sSeatSold) {
        this.sSeatSold = sSeatSold;
    }

    public Integer getsSeatTotal() {
        return sSeatTotal;
    }

    public void setsSeatTotal(Integer sSeatTotal) {
        this.sSeatTotal = sSeatTotal;
    }

    public Integer getsStatus() {
        return sStatus;
    }

    public void setsStatus(Integer sStatus) {
        this.sStatus = sStatus;
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