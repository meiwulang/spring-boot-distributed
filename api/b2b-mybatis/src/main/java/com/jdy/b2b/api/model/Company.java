package com.jdy.b2b.api.model;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jdy.b2b.api.model.product.BaseDO;

public class Company extends BaseDO {

	@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	private  Date endDate;
	@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	private  Date startDate;

	private Long id;

	private Long cPid;

	private String cName;

	private Integer cType;

	private String cAddress;

	private String cNo;

	private String cFax;

	private String cCountry;

	private String cProvince;

	private String cCity;

	private String cArea;

	private Boolean cSettlement;

	private String cChargeName;

	private String cTel;

	private String cPhone;

	private String cIntroduce;

	private String cLogo;

	private String cSeal;

	private String cIdcard;

	private String cIdcardFront;

	private String cIdcardBack;

	private String cLicenseCode;

	private String cLicense;

	private String cSevicePhone;

	private Integer cOpenAccount;
	private Integer cStatus;

	private Date createTime;

	private Long createUser;
	@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	private Date updateTime;

	private Long updateUser;

	private String cProductType;

	private String sets;

	private boolean hasSetting;

	private String reason;

	public String getcSevicePhone() {
		return cSevicePhone;
	}

	public void setcSevicePhone(String cSevicePhone) {
		this.cSevicePhone = cSevicePhone;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public boolean isHasSetting() {
		return hasSetting;
	}

	public void setHasSetting(boolean hasSetting) {
		this.hasSetting = hasSetting;
	}

	public String getcProductType() {
		return cProductType;
	}

	public void setcProductType(String cProductType) {
		this.cProductType = cProductType;
	}

	public String getSets() {
		return sets;
	}

	public void setSets(String sets) {
		this.sets = sets;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getcPid() {
		return cPid;
	}

	public void setcPid(Long cPid) {
		this.cPid = cPid;
	}

	public String getcName() {
		return cName;
	}

	public void setcName(String cName) {
		this.cName = cName == null ? null : cName.trim();
	}

	public Integer getcType() {
		return cType;
	}

	public void setcType(Integer cType) {
		this.cType = cType;
	}

	public String getcAddress() {
		return cAddress;
	}

	public void setcAddress(String cAddress) {
		this.cAddress = cAddress == null ? null : cAddress.trim();
	}

	public String getcNo() {
		return cNo;
	}

	public void setcNo(String cNo) {
		this.cNo = cNo == null ? null : cNo.trim();
	}

	public String getcFax() {
		return cFax;
	}

	public void setcFax(String cFax) {
		this.cFax = cFax == null ? null : cFax.trim();
	}

	public String getcCountry() {
		return cCountry;
	}

	public void setcCountry(String cCountry) {
		this.cCountry = cCountry == null ? null : cCountry.trim();
	}

	public String getcProvince() {
		return cProvince;
	}

	public void setcProvince(String cProvince) {
		this.cProvince = cProvince == null ? null : cProvince.trim();
	}

	public String getcCity() {
		return cCity;
	}

	public void setcCity(String cCity) {
		this.cCity = cCity == null ? null : cCity.trim();
	}

	public String getcArea() {
		return cArea;
	}

	public void setcArea(String cArea) {
		this.cArea = cArea == null ? null : cArea.trim();
	}

	public Boolean getcSettlement() {
		return cSettlement;
	}

	public void setcSettlement(Boolean cSettlement) {
		this.cSettlement = cSettlement;
	}

	public String getcChargeName() {
		return cChargeName;
	}

	public void setcChargeName(String cChargeName) {
		this.cChargeName = cChargeName == null ? null : cChargeName.trim();
	}

	public String getcTel() {
		return cTel;
	}

	public void setcTel(String cTel) {
		this.cTel = cTel == null ? null : cTel.trim();
	}

	public String getcPhone() {
		return cPhone;
	}

	public void setcPhone(String cPhone) {
		this.cPhone = cPhone == null ? null : cPhone.trim();
	}

	public String getcIntroduce() {
		return cIntroduce;
	}

	public void setcIntroduce(String cIntroduce) {
		this.cIntroduce = cIntroduce == null ? null : cIntroduce.trim();
	}

	public String getcLogo() {
		return cLogo;
	}

	public void setcLogo(String cLogo) {
		this.cLogo = cLogo == null ? null : cLogo.trim();
	}

	public String getcSeal() {
		return cSeal;
	}

	public void setcSeal(String cSeal) {
		this.cSeal = cSeal == null ? null : cSeal.trim();
	}

	public String getcIdcard() {
		return cIdcard;
	}

	public void setcIdcard(String cIdcard) {
		this.cIdcard = cIdcard == null ? null : cIdcard.trim();
	}

	public String getcIdcardFront() {
		return cIdcardFront;
	}

	public void setcIdcardFront(String cIdcardFront) {
		this.cIdcardFront = cIdcardFront == null ? null : cIdcardFront.trim();
	}

	public String getcIdcardBack() {
		return cIdcardBack;
	}

	public void setcIdcardBack(String cIdcardBack) {
		this.cIdcardBack = cIdcardBack == null ? null : cIdcardBack.trim();
	}

	public String getcLicenseCode() {
		return cLicenseCode;
	}

	public void setcLicenseCode(String cLicenseCode) {
		this.cLicenseCode = cLicenseCode == null ? null : cLicenseCode.trim();
	}

	public String getcLicense() {
		return cLicense;
	}

	public void setcLicense(String cLicense) {
		this.cLicense = cLicense == null ? null : cLicense.trim();
	}

	public Integer getcOpenAccount() {
		return cOpenAccount;
	}

	public void setcOpenAccount(Integer cOpenAccount) {
		this.cOpenAccount = cOpenAccount;
	}

	public Integer getcStatus() {
		return cStatus;
	}

	public void setcStatus(Integer cStatus) {
		this.cStatus = cStatus;
	}

	@Override
	public Date getCreateTime() {
		return createTime;
	}

	@Override
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	@Override
	public Long getCreateUser() {
		return createUser;
	}

	@Override
	public void setCreateUser(Long createUser) {
		this.createUser = createUser;
	}

	@Override
	public Date getUpdateTime() {
		return updateTime;
	}

	@Override
	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}

	@Override
	public Long getUpdateUser() {
		return updateUser;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	@Override
	public void setUpdateUser(Long updateUser) {
		this.updateUser = updateUser;
	}



}