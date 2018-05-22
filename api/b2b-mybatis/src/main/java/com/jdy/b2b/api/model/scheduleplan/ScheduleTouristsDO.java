package com.jdy.b2b.api.model.scheduleplan;

/**
 * Created by zhangfofa on 2018/1/30.
 */
public class ScheduleTouristsDO {

    private Long orderId;

    private Long orderCreatorId;

    private String orderCreatorName;

    private String ticketPriceCategoryName;

    private Integer ticketType;

    private Long touristId;

    private String touristName;

    private String touristPhone;

    private Integer licenseType;

    private String licenseNo;

    private Integer touristStatus;

    private String startPlace;

    private String backPlace;

    private String orderNo;

    public Long getTouristId() {
        return touristId;
    }

    public void setTouristId(Long touristId) {
        this.touristId = touristId;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getOrderCreatorId() {
        return orderCreatorId;
    }

    public void setOrderCreatorId(Long orderCreatorId) {
        this.orderCreatorId = orderCreatorId;
    }

    public String getOrderCreatorName() {
        return orderCreatorName;
    }

    public void setOrderCreatorName(String orderCreatorName) {
        this.orderCreatorName = orderCreatorName;
    }

    public String getTicketPriceCategoryName() {
        return ticketPriceCategoryName;
    }

    public void setTicketPriceCategoryName(String ticketPriceCategoryName) {
        this.ticketPriceCategoryName = ticketPriceCategoryName;
    }

    public Integer getTicketType() {
        return ticketType;
    }

    public void setTicketType(Integer ticketType) {
        this.ticketType = ticketType;
    }

    public String getTouristName() {
        return touristName;
    }

    public void setTouristName(String touristName) {
        this.touristName = touristName;
    }

    public String getTouristPhone() {
        return touristPhone;
    }

    public void setTouristPhone(String touristPhone) {
        this.touristPhone = touristPhone;
    }

    public Integer getLicenseType() {
        return licenseType;
    }

    public void setLicenseType(Integer licenseType) {
        this.licenseType = licenseType;
    }

    public String getLicenseNo() {
        return licenseNo;
    }

    public void setLicenseNo(String licenseNo) {
        this.licenseNo = licenseNo;
    }

    public Integer getTouristStatus() {
        return touristStatus;
    }

    public void setTouristStatus(Integer touristStatus) {
        this.touristStatus = touristStatus;
    }

    public String getStartPlace() {
        return startPlace;
    }

    public void setStartPlace(String startPlace) {
        this.startPlace = startPlace;
    }

    public String getBackPlace() {
        return backPlace;
    }

    public void setBackPlace(String backPlace) {
        this.backPlace = backPlace;
    }

    public String getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(String orderNo) {
        this.orderNo = orderNo;
    }
}
