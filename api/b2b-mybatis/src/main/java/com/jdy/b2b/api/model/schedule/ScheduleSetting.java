package com.jdy.b2b.api.model.schedule;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jdy.b2b.api.common.BaseVO;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

public class ScheduleSetting extends BaseVO{
    private Long id;

    private Long scheduleId;
    @JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime returnDate;

    private String banner;

    private String touristGuide;
    @JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime musterTime;

    private String musterPlace;

    private String emergencyCall;

    private String emergencyContact;

    private Byte status;
    @JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startDate;

    private Integer childTouristsNum;

    private Integer adultTouristsNum;

    private String userName;

    private Long companyId;

    private String companyName;

    private String productName;

    private String userPhone;

    private String groupNo;

    private Byte departureStatus;

    private Date cancelTime;

    private Long cancelUser;

    private String cancelUserName;

    private String cancelComment;

    private Date confirmTime;


    public Date getConfirmTime() {
        return confirmTime;
    }

    public void setConfirmTime(Date confirmTime) {
        this.confirmTime = confirmTime;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getCancelUserName() {
        return cancelUserName;
    }

    public void setCancelUserName(String cancelUserName) {
        this.cancelUserName = cancelUserName;
    }

    public Byte getDepartureStatus() {
        return departureStatus;
    }

    public void setDepartureStatus(Byte departureStatus) {
        this.departureStatus = departureStatus;
    }

    public Date getCancelTime() {
        return cancelTime;
    }

    public void setCancelTime(Date cancelTime) {
        this.cancelTime = cancelTime;
    }

    public Long getCancelUser() {
        return cancelUser;
    }

    public void setCancelUser(Long cancelUser) {
        this.cancelUser = cancelUser;
    }

    public String getCancelComment() {
        return cancelComment;
    }

    public void setCancelComment(String cancelComment) {
        this.cancelComment = cancelComment;
    }

    public String getGroupNo() {
        return groupNo;
    }

    public void setGroupNo(String groupNo) {
        this.groupNo = groupNo;
    }

    public String getUserPhone() {
        return userPhone;
    }

    public void setUserPhone(String userPhone) {
        this.userPhone = userPhone;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(Long scheduleId) {
        this.scheduleId = scheduleId;
    }

    public LocalDateTime getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(LocalDateTime returnDate) {
        this.returnDate = returnDate;
    }

    public String getBanner() {
        return banner;
    }

    public void setBanner(String banner) {
        this.banner = banner == null ? null : banner.trim();
    }

    public String getTouristGuide() {
        return touristGuide;
    }

    public void setTouristGuide(String touristGuide) {
        this.touristGuide = touristGuide == null ? null : touristGuide.trim();
    }

    public LocalDateTime getMusterTime() {
        return musterTime;
    }

    public void setMusterTime(LocalDateTime musterTime) {
        this.musterTime = musterTime;
    }

    public String getMusterPlace() {
        return musterPlace;
    }

    public void setMusterPlace(String musterPlace) {
        this.musterPlace = musterPlace == null ? null : musterPlace.trim();
    }

    public String getEmergencyCall() {
        return emergencyCall;
    }

    public void setEmergencyCall(String emergencyCall) {
        this.emergencyCall = emergencyCall == null ? null : emergencyCall.trim();
    }

    public String getEmergencyContact() {
        return emergencyContact;
    }

    public void setEmergencyContact(String emergencyContact) {
        this.emergencyContact = emergencyContact == null ? null : emergencyContact.trim();
    }

    public Byte getStatus() {
        return status;
    }

    public void setStatus(Byte status) {
        this.status = status;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public Integer getChildTouristsNum() {
        return childTouristsNum;
    }

    public void setChildTouristsNum(Integer childTouristsNum) {
        this.childTouristsNum = childTouristsNum;
    }

    public Integer getAdultTouristsNum() {
        return adultTouristsNum;
    }

    public void setAdultTouristsNum(Integer adultTouristsNum) {
        this.adultTouristsNum = adultTouristsNum;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName == null ? null : userName.trim();
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName == null ? null : companyName.trim();
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName == null ? null : productName.trim();
    }
}