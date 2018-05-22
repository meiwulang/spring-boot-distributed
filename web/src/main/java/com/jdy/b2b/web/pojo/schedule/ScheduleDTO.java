package com.jdy.b2b.web.pojo.schedule;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.util.Date;

@ApiModel(description = "班期")
public class ScheduleDTO {

    @ApiModelProperty("主键id")
    private Long id;

    @ApiModelProperty("线路ID")
    private Long sProductId;

    @ApiModelProperty("班期编号")
    private String sScheduleNo;

    @ApiModelProperty("开始时间")
    private Date sCalendar;

    @ApiModelProperty("周几1:星期一2:星期二")
    private Integer sWeekDay;

    @ApiModelProperty("班期名称")
    private String sScheduleName;

    @ApiModelProperty("车辆数")
    private Integer sCarNum;

    @ApiModelProperty("每车座位数")
    private Integer sCarSeats;

    @ApiModelProperty("出发时分")
    private Date sLeaveTime;

    @ApiModelProperty("停售时间")
    private Integer sStopSale;

    @ApiModelProperty("停售类型 0:分钟 1:小时 2:天数")
    private Integer sStopType;

    @ApiModelProperty("虚拟已售数")
    private Integer sShamNum;

    @ApiModelProperty("是否打印0:打印 1:不打印")
    private Boolean sPrint;

    @ApiModelProperty("入座方式 0:不对号入座 1:对号入座(系统随机) 2:对号入座(人工选择)")
    private Integer sSitType;

    @ApiModelProperty("成团人数")
    private Integer sGroupNum;

    @ApiModelProperty("状态 0:正常 1:暂停 2:删除")
    private Integer sStatus;

    @ApiModelProperty("所有车辆座位预留数")
    private Integer sSeatHold;

    @ApiModelProperty("所有车辆座位锁定数")
    private Integer sSeatLock;

    @ApiModelProperty("所有车辆总座位数")
    private Integer sSeatTotal;

    @ApiModelProperty("已售座位数")
    private Integer sSeatSold;

    @ApiModelProperty("剩余座位数")
    private Integer sSeatLeft;

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
        this.sScheduleNo = sScheduleNo;
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

    public String getsScheduleName() {
        return sScheduleName;
    }

    public void setsScheduleName(String sScheduleName) {
        this.sScheduleName = sScheduleName;
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

    public Integer getsStatus() {
        return sStatus;
    }

    public void setsStatus(Integer sStatus) {
        this.sStatus = sStatus;
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

    public Integer getsSeatTotal() {
        return sSeatTotal;
    }

    public void setsSeatTotal(Integer sSeatTotal) {
        this.sSeatTotal = sSeatTotal;
    }

    public Integer getsSeatSold() {
        return sSeatSold;
    }

    public void setsSeatSold(Integer sSeatSold) {
        this.sSeatSold = sSeatSold;
    }

    public Integer getsSeatLeft() {
        return sSeatLeft;
    }

    public void setsSeatLeft(Integer sSeatLeft) {
        this.sSeatLeft = sSeatLeft;
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