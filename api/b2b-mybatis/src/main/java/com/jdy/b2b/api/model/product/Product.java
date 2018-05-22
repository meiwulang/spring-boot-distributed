package com.jdy.b2b.api.model.product;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

public class Product extends BaseDO {
	private Long id;

	private Long companyId;
	private String tcStartDay;
	private String tcEndDay;
	private String pNo;

	private String pName;

	private String pShortName;
	private String pPym;

	private String pDestination;
	private String pDestinationPym;
	private Integer pDestinationLocation;
	private String pDestinationRegion;
	private String pDestinationArea;
	private Long pGroup;

	private Integer pBrand;

	private Integer pType;

	private Long pContacts;
	private String pContactName;

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
	private Integer pFrom;
	private String pFromName;

	private String brokerage1; // 一级佣金百分比 XX.YY 格式
	private String brokerage2;
	private String brokerage3;

	private Integer pPayWay;

	private Integer pFirstPayType;
	private BigDecimal pPayAmount;

	private String templateTitle;

	private Integer offlineSignStatus;

	private String pDestinationDisc;
	private Date lifeStartDate;
	private Date lifeEndDate;
	private Integer updated;
	private Integer isSaler=0;
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

	public Integer getIsSaler() {
		return isSaler;
	}

	public void setIsSaler(Integer isSaler) {
		this.isSaler = isSaler;
	}
	public Integer getUpdated() {
		return updated;
	}

	public void setUpdated(Integer updated) {
		this.updated = updated;
	}

	public Date getLifeStartDate() {
		return lifeStartDate;
	}

	public void setLifeStartDate(Date lifeStartDate) {
		this.lifeStartDate = lifeStartDate;
	}

	public Date getLifeEndDate() {
		return lifeEndDate;
	}

	public void setLifeEndDate(Date lifeEndDate) {
		this.lifeEndDate = lifeEndDate;
	}
	public String getpDestinationDisc() {
		return pDestinationDisc;
	}

	public void setpDestinationDisc(String pDestinationDisc) {
		this.pDestinationDisc = pDestinationDisc;
	}

	public Integer getpFirstPayType() {
		return pFirstPayType;
	}

	public void setpFirstPayType(Integer pFirstPayType) {
		this.pFirstPayType = pFirstPayType;
	}


	private Byte ascription;  //产品归属

	private List<Long> assembleCompanyIds;//产品允许集结单位ids


	public List<Long> getAssembleCompanyIds() {
		return assembleCompanyIds;
	}

	public void setAssembleCompanyIds(List<Long> assembleCompanyIds) {
		this.assembleCompanyIds = assembleCompanyIds;
	}

	public Byte getAscription() {
		return ascription;
	}

	public void setAscription(Byte ascription) {
		this.ascription = ascription;
	}

	public Integer getpPayWay() {
		return pPayWay;
	}

	public void setpPayWay(Integer pPayWay) {
		this.pPayWay = pPayWay;
	}

	public BigDecimal getpPayAmount() {
		return pPayAmount;
	}

	public void setpPayAmount(BigDecimal pPayAmount) {
		this.pPayAmount = pPayAmount;
	}

	public Integer getpFrom() {
		return pFrom;
	}

	public void setpFrom(Integer pFrom) {
		this.pFrom = pFrom;
	}

	public String getpFromName() {
		return pFromName;
	}

	public void setpFromName(String pFromName) {
		this.pFromName = pFromName;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@Override
	public Long getCompanyId() {
		return companyId;
	}

	@Override
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

	@Override
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

	private Integer lineType;

	public Integer getLineType() {
		return lineType;
	}

	public void setLineType(Integer lineType) {
		this.lineType = lineType;
	}

	public void setpSort(Integer pSort) {
		this.pSort = pSort;
	}

	public String getpPym() {
		return pPym;
	}

	public void setpPym(String pPym) {
		this.pPym = pPym;
	}

	public String getpContactName() {
		return pContactName;
	}

	public void setpContactName(String pContactName) {
		this.pContactName = pContactName;
	}

	public String getTcStartDay() {
		return tcStartDay;
	}

	public void setTcStartDay(String tcStartDay) {
		this.tcStartDay = tcStartDay;
	}

	public String getTcEndDay() {
		return tcEndDay;
	}

	public void setTcEndDay(String tcEndDay) {
		this.tcEndDay = tcEndDay;
	}

	public String getBrokerage1() {
		return brokerage1;
	}

	public void setBrokerage1(String brokerage1) {
		this.brokerage1 = brokerage1;
	}

	public String getBrokerage2() {
		return brokerage2;
	}

	public void setBrokerage2(String brokerage2) {
		this.brokerage2 = brokerage2;
	}

	public String getBrokerage3() {
		return brokerage3;
	}

	public void setBrokerage3(String brokerage3) {
		this.brokerage3 = brokerage3;
	}

	public String getpDestination() {
		return pDestination;
	}

	public void setpDestination(String pDestination) {
		this.pDestination = pDestination;
	}

	public String getpDestinationPym() {
		return pDestinationPym;
	}

	public void setpDestinationPym(String pDestinationPym) {
		this.pDestinationPym = pDestinationPym;
	}

	public String getTemplateTitle() {
		return templateTitle;
	}

	public void setTemplateTitle(String templateTitle) {
		this.templateTitle = templateTitle;
	}

	public Integer getOfflineSignStatus() {
		return offlineSignStatus;
	}

	public void setOfflineSignStatus(Integer offlineSignStatus) {
		this.offlineSignStatus = offlineSignStatus;
	}

	public Long getpGroup() {
		return pGroup;
	}

	public void setpGroup(Long pGroup) {
		this.pGroup = pGroup;
	}
	private String pStaff;
	private String pJobless;
	private String pStudent;
	private String pPreschool;
	private String pProfessional;
	private String pRetiree;
	private String pCostRemark;

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
	
}