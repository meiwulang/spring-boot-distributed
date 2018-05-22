package com.jdy.b2b.web.pojo.productRecommend;

import java.util.Date;

public class Product{
	private Long id;

	private Long companyId;

	private String pNo;

	private String pName;

	private String pShortName;

	private Integer pBrand;

	private Integer pType;

	private Long pContacts;

	private Integer pDays;

	private String pQq;

	private String pPhone;

	private Byte pRecommend;

	private Byte pConfirm;

	private Integer pStatus;
	private Integer pSort;

	private Date createTime;

	private Long createUser;

	private Date updateTime;

	private Long updateUser;
	private String pStaff;
	private String pJobless;
	private String pStudent;
	private String pPreschool;
	private String pProfessional;
	private String pRetiree;
	private String pCostRemark;
	private Integer pDestinationLocation;
	private String pDestinationRegion;
	private String pDestinationArea;
	private String pContactsEn;
	private String pCreativeOfficerCn;
	private String pCreativeOfficerEn;
	private String pTopicCn;
	private String pTopicEn;
	
	public String getpContactsEn() {
		return pContactsEn;
	}

	public void setpContactsEn(String pContactsEn) {
		this.pContactsEn = pContactsEn;
	}

	public String getpCreativeOfficerCn() {
		return pCreativeOfficerCn;
	}

	public void setpCreativeOfficerCn(String pCreativeOfficerCn) {
		this.pCreativeOfficerCn = pCreativeOfficerCn;
	}

	public String getpCreativeOfficerEn() {
		return pCreativeOfficerEn;
	}

	public void setpCreativeOfficerEn(String pCreativeOfficerEn) {
		this.pCreativeOfficerEn = pCreativeOfficerEn;
	}

	public String getpTopicCn() {
		return pTopicCn;
	}

	public void setpTopicCn(String pTopicCn) {
		this.pTopicCn = pTopicCn;
	}

	public String getpTopicEn() {
		return pTopicEn;
	}

	public void setpTopicEn(String pTopicEn) {
		this.pTopicEn = pTopicEn;
	}

	public Integer getpDestinationLocation() {
		return pDestinationLocation;
	}

	public void setpDestinationLocation(Integer pDestinationLocation) {
		this.pDestinationLocation = pDestinationLocation;
	}

	public String getpDestinationRegion() {
		return pDestinationRegion;
	}

	public void setpDestinationRegion(String pDestinationRegion) {
		this.pDestinationRegion = pDestinationRegion;
	}

	public String getpDestinationArea() {
		return pDestinationArea;
	}

	public void setpDestinationArea(String pDestinationArea) {
		this.pDestinationArea = pDestinationArea;
	}
	public String getpCostRemark() {
		return pCostRemark;
	}

	public void setpCostRemark(String pCostRemark) {
		this.pCostRemark = pCostRemark;
	}
	public String getpStaff() {
		return pStaff;
	}

	public void setpStaff(String pStaff) {
		this.pStaff = pStaff;
	}

	public String getpJobless() {
		return pJobless;
	}

	public void setpJobless(String pJobless) {
		this.pJobless = pJobless;
	}

	public String getpStudent() {
		return pStudent;
	}

	public void setpStudent(String pStudent) {
		this.pStudent = pStudent;
	}

	public String getpPreschool() {
		return pPreschool;
	}

	public void setpPreschool(String pPreschool) {
		this.pPreschool = pPreschool;
	}

	public String getpProfessional() {
		return pProfessional;
	}

	public void setpProfessional(String pProfessional) {
		this.pProfessional = pProfessional;
	}

	public String getpRetiree() {
		return pRetiree;
	}

	public void setpRetiree(String pRetiree) {
		this.pRetiree = pRetiree;
	}
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getCompanyId() {
		return companyId;
	}

	public void setCompanyId(Long companyId) {
		this.companyId = companyId;
	}

	public String getpNo() {
		return pNo;
	}

	public void setpNo(String pNo) {
		this.pNo = pNo == null ? null : pNo.trim();
	}

	public String getpName() {
		return pName;
	}

	public void setpName(String pName) {
		this.pName = pName == null ? null : pName.trim();
	}

	public String getpShortName() {
		return pShortName;
	}

	public void setpShortName(String pShortName) {
		this.pShortName = pShortName == null ? null : pShortName.trim();
	}

	public Integer getpBrand() {
		return pBrand;
	}

	public void setpBrand(Integer pBrand) {
		this.pBrand = pBrand;
	}

	public Integer getpType() {
		return pType;
	}

	public void setpType(Integer pType) {
		this.pType = pType;
	}

	public Long getpContacts() {
		return pContacts;
	}

	public void setpContacts(Long pContacts) {
		this.pContacts = pContacts;
	}

	public Integer getpDays() {
		return pDays;
	}

	public void setpDays(Integer pDays) {
		this.pDays = pDays;
	}

	public String getpQq() {
		return pQq;
	}

	public void setpQq(String pQq) {
		this.pQq = pQq == null ? null : pQq.trim();
	}

	public String getpPhone() {
		return pPhone;
	}

	public void setpPhone(String pPhone) {
		this.pPhone = pPhone == null ? null : pPhone.trim();
	}

	public Byte getpRecommend() {
		return pRecommend;
	}

	public void setpRecommend(Byte pRecommend) {
		this.pRecommend = pRecommend;
	}

	public Byte getpConfirm() {
		return pConfirm;
	}

	public void setpConfirm(Byte pConfirm) {
		this.pConfirm = pConfirm;
	}

	public Integer getpStatus() {
		return pStatus;
	}

	public void setpStatus(Integer pStatus) {
		this.pStatus = pStatus;
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

	private String pSpecial;

	private String pCostInclude;

	private String pCostExclude;

	private String pNotes;

	private String pVisa;

	public String getpSpecial() {
		return pSpecial;
	}

	public void setpSpecial(String pSpecial) {
		this.pSpecial = pSpecial == null ? null : pSpecial.trim();
	}

	public String getpCostInclude() {
		return pCostInclude;
	}

	public void setpCostInclude(String pCostInclude) {
		this.pCostInclude = pCostInclude == null ? null : pCostInclude.trim();
	}

	public String getpCostExclude() {
		return pCostExclude;
	}

	public void setpCostExclude(String pCostExclude) {
		this.pCostExclude = pCostExclude == null ? null : pCostExclude.trim();
	}

	public String getpNotes() {
		return pNotes;
	}

	public void setpNotes(String pNotes) {
		this.pNotes = pNotes == null ? null : pNotes.trim();
	}

	public String getpVisa() {
		return pVisa;
	}

	public void setpVisa(String pVisa) {
		this.pVisa = pVisa == null ? null : pVisa.trim();
	}

	public void initCreateTime() {
		this.createTime = new Date();
	}

	public void initUpdateTime() {
		this.updateTime = new Date();
	}

	public void initCreatetimeAndUpdateTime() {
		this.createTime = new Date();
		this.updateTime = new Date();
	}

	public Integer getpSort() {
		return pSort;
	}

	public void setpSort(Integer pSort) {
		this.pSort = pSort;
	}

}