package com.jdy.b2b.api.model.schedule;


import java.math.BigDecimal;
import java.util.Date;

/**
 * Created by darker on 2018/03/06.
 */
public class ScheduleInfo {
    private Long id;

    private Long productId;

    private String scheduleNo;

    private String scheduleName;

    private String groupOrderNo;

    private Date calendar;

    private String productName;

    private String companyName;

    private String userName;

    private String userPhone;

    private Integer adultTouristsNum;

    private Integer childTouristsNum;

    private Date startDate;

    private Date returnDate;

    private Integer status;

    private Integer departureStatus;

    private BigDecimal orderAmount;

    private Integer orderNums;

    private Integer orderTickets;

    private Integer orderVisitors;

    private BigDecimal costAmt;

    private Long costUpdater;

    private Date costTime;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getScheduleNo() {
        return scheduleNo;
    }

    public void setScheduleNo(String scheduleNo) {
        this.scheduleNo = scheduleNo;
    }

    public String getScheduleName() {
        return scheduleName;
    }

    public void setScheduleName(String scheduleName) {
        this.scheduleName = scheduleName;
    }

    public String getGroupOrderNo() {
        return groupOrderNo;
    }

    public void setGroupOrderNo(String groupOrderNo) {
        this.groupOrderNo = groupOrderNo;
    }

    public Date getCalendar() {
        return calendar;
    }

    public void setCalendar(Date calendar) {
        this.calendar = calendar;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserPhone() {
        return userPhone;
    }

    public void setUserPhone(String userPhone) {
        this.userPhone = userPhone;
    }

    public Integer getAdultTouristsNum() {
        return adultTouristsNum;
    }

    public void setAdultTouristsNum(Integer adultTouristsNum) {
        this.adultTouristsNum = adultTouristsNum;
    }

    public Integer getChildTouristsNum() {
        return childTouristsNum;
    }

    public void setChildTouristsNum(Integer childTouristsNum) {
        this.childTouristsNum = childTouristsNum;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(Date returnDate) {
        this.returnDate = returnDate;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getDepartureStatus() {
        return departureStatus;
    }

    public void setDepartureStatus(Integer departureStatus) {
        this.departureStatus = departureStatus;
    }

    public BigDecimal getOrderAmount() {
        return orderAmount;
    }

    public void setOrderAmount(BigDecimal orderAmount) {
        this.orderAmount = orderAmount;
    }

    public Integer getOrderNums() {
        return orderNums;
    }

    public void setOrderNums(Integer orderNums) {
        this.orderNums = orderNums;
    }

    public Integer getOrderTickets() {
        return orderTickets;
    }

    public void setOrderTickets(Integer orderTickets) {
        this.orderTickets = orderTickets;
    }

    public Integer getOrderVisitors() {
        return orderVisitors;
    }

    public void setOrderVisitors(Integer orderVisitors) {
        this.orderVisitors = orderVisitors;
    }

    public BigDecimal getCostAmt() {
        return costAmt;
    }

    public void setCostAmt(BigDecimal costAmt) {
        this.costAmt = costAmt;
    }

    public Long getCostUpdater() {
        return costUpdater;
    }

    public void setCostUpdater(Long costUpdater) {
        this.costUpdater = costUpdater;
    }

    public Date getCostTime() {
        return costTime;
    }

    public void setCostTime(Date costTime) {
        this.costTime = costTime;
    }
}