package com.jdy.b2b.api.model.designProject;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

public class Require {
    private Long id;

    private Long dId;

    private Integer rType;

    private String requireNo;

    private Long rCompanyId;

    private String rStartCity;

    private String rDestinationCitys;

    private Integer rStartDateHead;

    private Integer rStartDateTail;

    private Integer rPlayDaysMin;

    private Integer rPlayDaysMax;

    private Integer rAdultNum;

    private Integer rChildNum;

    private Integer rBabyNum;

    private Integer rPerBudget;

    private String rOptionalServices;

    private String rOtherRequire;

    private String rHeadName;

    private Integer rHeadSex;

    private String rHeadPhone;

    private String rHeadWx;

    private String rHeadEmail;
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone="GMT+8")
    private Date createTime;

    public Integer getrType() {
        return rType;
    }

    public void setrType(Integer rType) {
        this.rType = rType;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getdId() {
        return dId;
    }

    public void setdId(Long dId) {
        this.dId = dId;
    }

    public String getRequireNo() {
        return requireNo;
    }

    public void setRequireNo(String requireNo) {
        this.requireNo = requireNo == null ? null : requireNo.trim();
    }

    public Long getrCompanyId() {
        return rCompanyId;
    }

    public void setrCompanyId(Long rCompanyId) {
        this.rCompanyId = rCompanyId;
    }

    public String getrStartCity() {
        return rStartCity;
    }

    public void setrStartCity(String rStartCity) {
        this.rStartCity = rStartCity == null ? null : rStartCity.trim();
    }

    public String getrDestinationCitys() {
        return rDestinationCitys;
    }

    public void setrDestinationCitys(String rDestinationCitys) {
        this.rDestinationCitys = rDestinationCitys == null ? null : rDestinationCitys.trim();
    }

    public Integer getrStartDateHead() {
        return rStartDateHead;
    }

    public void setrStartDateHead(Integer rStartDateHead) {
        this.rStartDateHead = rStartDateHead;
    }

    public Integer getrStartDateTail() {
        return rStartDateTail;
    }

    public void setrStartDateTail(Integer rStartDateTail) {
        this.rStartDateTail = rStartDateTail;
    }

    public Integer getrPlayDaysMin() {
        return rPlayDaysMin;
    }

    public void setrPlayDaysMin(Integer rPlayDaysMin) {
        this.rPlayDaysMin = rPlayDaysMin;
    }

    public Integer getrPlayDaysMax() {
        return rPlayDaysMax;
    }

    public void setrPlayDaysMax(Integer rPlayDaysMax) {
        this.rPlayDaysMax = rPlayDaysMax;
    }

    public Integer getrAdultNum() {
        return rAdultNum;
    }

    public void setrAdultNum(Integer rAdultNum) {
        this.rAdultNum = rAdultNum;
    }

    public Integer getrChildNum() {
        return rChildNum;
    }

    public void setrChildNum(Integer rChildNum) {
        this.rChildNum = rChildNum;
    }

    public Integer getrBabyNum() {
        return rBabyNum;
    }

    public void setrBabyNum(Integer rBabyNum) {
        this.rBabyNum = rBabyNum;
    }

    public Integer getrPerBudget() {
        return rPerBudget;
    }

    public void setrPerBudget(Integer rPerBudget) {
        this.rPerBudget = rPerBudget;
    }

    public String getrOptionalServices() {
        return rOptionalServices;
    }

    public void setrOptionalServices(String rOptionalServices) {
        this.rOptionalServices = rOptionalServices == null ? null : rOptionalServices.trim();
    }

    public String getrOtherRequire() {
        return rOtherRequire;
    }

    public void setrOtherRequire(String rOtherRequire) {
        this.rOtherRequire = rOtherRequire == null ? null : rOtherRequire.trim();
    }

    public String getrHeadName() {
        return rHeadName;
    }

    public void setrHeadName(String rHeadName) {
        this.rHeadName = rHeadName == null ? null : rHeadName.trim();
    }

    public Integer getrHeadSex() {
        return rHeadSex;
    }

    public void setrHeadSex(Integer rHeadSex) {
        this.rHeadSex = rHeadSex;
    }

    public String getrHeadPhone() {
        return rHeadPhone;
    }

    public void setrHeadPhone(String rHeadPhone) {
        this.rHeadPhone = rHeadPhone == null ? null : rHeadPhone.trim();
    }

    public String getrHeadWx() {
        return rHeadWx;
    }

    public void setrHeadWx(String rHeadWx) {
        this.rHeadWx = rHeadWx == null ? null : rHeadWx.trim();
    }

    public String getrHeadEmail() {
        return rHeadEmail;
    }

    public void setrHeadEmail(String rHeadEmail) {
        this.rHeadEmail = rHeadEmail == null ? null : rHeadEmail.trim();
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }
}