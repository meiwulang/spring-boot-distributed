package com.jdy.b2b.api.model.scheduleplan;

import java.util.Date;

/**
 * Created by zhangfofa on 2018/1/30.
 */
public class ScheduleManagerDO {

    private Long scheduleId;

    private Long productId;

    private Integer departureStatus;

    private Date outGroupTime;

    private Integer groupPeopleNum;

    private String routeName;

    private String groupNo;

    private Integer touristsNum;

    private Integer tripDays;

    private String destination;

    private Integer routeType;

    private String productManager;

    private String createGroupName;

    private Date backGroupTime;

    private Date scheduleTime;

    private Long scheduleSettingId;

    private Integer costingStatus;

    public Integer getCostingStatus() {
        return costingStatus;
    }

    public void setCostingStatus(Integer costingStatus) {
        this.costingStatus = costingStatus;
    }

    public Long getScheduleSettingId() {
        return scheduleSettingId;
    }

    public void setScheduleSettingId(Long scheduleSettingId) {
        this.scheduleSettingId = scheduleSettingId;
    }

    public Long getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(Long scheduleId) {
        this.scheduleId = scheduleId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getDepartureStatus() {
        return departureStatus;
    }

    public void setDepartureStatus(Integer departureStatus) {
        this.departureStatus = departureStatus;
    }

    public Date getOutGroupTime() {
        return outGroupTime;
    }

    public void setOutGroupTime(Date outGroupTime) {
        this.outGroupTime = outGroupTime;
    }

    public Integer getGroupPeopleNum() {
        return groupPeopleNum;
    }

    public void setGroupPeopleNum(Integer groupPeopleNum) {
        this.groupPeopleNum = groupPeopleNum;
    }

    public String getRouteName() {
        return routeName;
    }

    public void setRouteName(String routeName) {
        this.routeName = routeName;
    }

    public String getGroupNo() {
        return groupNo;
    }

    public void setGroupNo(String groupNo) {
        this.groupNo = groupNo;
    }

    public Integer getTouristsNum() {
        return touristsNum;
    }

    public void setTouristsNum(Integer touristsNum) {
        this.touristsNum = touristsNum;
    }

    public Integer getTripDays() {
        return tripDays;
    }

    public void setTripDays(Integer tripDays) {
        this.tripDays = tripDays;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public Integer getRouteType() {
        return routeType;
    }

    public void setRouteType(Integer routeType) {
        this.routeType = routeType;
    }

    public String getProductManager() {
        return productManager;
    }

    public void setProductManager(String productManager) {
        this.productManager = productManager;
    }

    public String getCreateGroupName() {
        return createGroupName;
    }

    public void setCreateGroupName(String createGroupName) {
        this.createGroupName = createGroupName;
    }

    public Date getBackGroupTime() {
        return backGroupTime;
    }

    public void setBackGroupTime(Date backGroupTime) {
        this.backGroupTime = backGroupTime;
    }

    public Date getScheduleTime() {
        return scheduleTime;
    }

    public void setScheduleTime(Date scheduleTime) {
        this.scheduleTime = scheduleTime;
    }
}
