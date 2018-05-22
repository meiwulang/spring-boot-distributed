package com.jdy.b2b.api.vo.product;

import com.jdy.b2b.api.common.BaseVO;
import com.jdy.b2b.api.common.constants.annotations.*;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;

import javax.validation.constraints.Max;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/**
 * @Description 产品vo
 * @author 王斌
 * @date 2017年7月3日 下午5:48:23
 * @version V1.0
 */
public class ProductVO extends BaseVO {
	@NotNull(groups = { Update.class, Delete.class })
	private Long id;
	@NotNull(groups = { Save.class })
	private String cover;
	@NotNull(groups = { Save.class })
	@EnumValue(enums = { "0", "1" }, groups = Save.class, message = "线路类型可选值")
	private Integer lineType;

	// @NotNull(groups = { Save.class, Update.class, Delete.class, Query.class
	// })
	private Long companyId;

	@NotBlank(groups = { Save.class, Update.class })
	@Length(max = 20, groups = { Save.class, Update.class })
	@Pattern(regexp = "^[0-9a-zA-Z]{1,20}$", groups = { Save.class,
			Update.class })
	private String pNo;

	@NotBlank(groups = { Save.class, Update.class })
	@Length(max = 50, groups = { Save.class, Update.class })
	private String pName;

	@Length(max = 20, groups = { Save.class, Update.class })
	private String pShortName;

	@NotNull(groups = { Save.class, Update.class })
	private Integer pBrand;

	@NotNull(groups = { Save.class, Update.class })
	private Integer pType;
	@Max(value = 999999999999L, groups = { Save.class, Update.class })
	private Long pContacts;

	// @NotNull(groups = { Save.class, Update.class })
	// private Integer pDays;
	@Length(max = 20, groups = { Save.class, Update.class })
	@Pattern(regexp = "^[0-9]{5,20}$|^\\s*$", groups = { Save.class,
			Update.class })
	private String pQq;

	@Length(max = 20, groups = { Save.class, Update.class })
	@Pattern(regexp = "(?:(\\(\\+?86\\))(0[0-9]{2,3}\\-?)?([2-9][0-9]{6,7})+(\\-[0-9]{1,4})?)|"
			+ "(?:(86-?)?(0[0-9]{2,3}\\-?)?([2-9][0-9]{6,7})+(\\-[0-9]{1,4})?)|"
			+ "^(1[34578]\\d{9})?$|^\\s*$", groups = { Save.class,
					Update.class })
	private String pPhone;
	@EnumValue(message = "推荐状态可选值,推荐 0:不推荐  1:推荐普通 2:推荐精选", enums = { "0", "1",
			"2" }, groups = { UpdateSingleField.class })
	private Byte pRecommend = 0;
	@EnumValue(enums = { "0", "1" }, groups = { UpdateSingleField.class })
	private Byte pConfirm = 1;

	private String pDestination;
	private String pDestinationPym;

	private Integer pStatus;
	private Integer pSort;

	private String pSpecial;

	private String pCostInclude;

	private String pCostExclude;

	private String pNotes;

	private String pVisa;
	private Integer pFrom;
	private String pFromName;

	private Integer pPayWay;

	private Integer pFirstPayType;

	private BigDecimal pPayAmount;

	private Byte ascription;

	private List<Long> assembleCompanyIds;
	private String pGroup;
	private Integer isSaler=0;
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
	public Integer getIsSaler() {
		return isSaler;
	}

	public void setIsSaler(Integer isSaler) {
		this.isSaler = isSaler;
	}

	public String getpGroup() {
		return pGroup;
	}

	public void setpGroup(String pGroup) {
		this.pGroup = pGroup;
	}

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
	public Integer getpFirstPayType() {
		return pFirstPayType;
	}

	public void setpFirstPayType(Integer pFirstPayType) {
		this.pFirstPayType = pFirstPayType;
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
		this.pNo = pNo;
	}

	public String getpName() {
		return pName;
	}

	public void setpName(String pName) {
		this.pName = pName;
	}

	public String getpShortName() {
		return pShortName;
	}

	public void setpShortName(String pShortName) {
		this.pShortName = pShortName;
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

	// public Integer getpDays() {
	// return pDays;
	// }
	//
	// public void setpDays(Integer pDays) {
	// this.pDays = pDays;
	// }

	public String getpQq() {
		return pQq;
	}

	public void setpQq(String pQq) {
		this.pQq = pQq;
	}

	public String getpPhone() {
		return pPhone;
	}

	public void setpPhone(String pPhone) {
		this.pPhone = pPhone;
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

	public String getpSpecial() {
		return pSpecial;
	}

	public void setpSpecial(String pSpecial) {
		this.pSpecial = pSpecial;
	}

	public String getpCostInclude() {
		return pCostInclude;
	}

	public void setpCostInclude(String pCostInclude) {
		this.pCostInclude = pCostInclude;
	}

	public String getpCostExclude() {
		return pCostExclude;
	}

	public void setpCostExclude(String pCostExclude) {
		this.pCostExclude = pCostExclude;
	}

	public String getpNotes() {
		return pNotes;
	}

	public void setpNotes(String pNotes) {
		this.pNotes = pNotes;
	}

	public String getpVisa() {
		return pVisa;
	}

	public void setpVisa(String pVisa) {
		this.pVisa = pVisa;
	}

	public String getCover() {
		return cover;
	}

	public void setCover(String cover) {
		this.cover = cover;
	}

	public Integer getpSort() {
		return pSort;
	}

	public void setpSort(Integer pSort) {
		this.pSort = pSort;
	}

	public Integer getLineType() {
		return lineType;
	}

	public void setLineType(Integer lineType) {
		this.lineType = lineType;
	}

	private String tcStartDay;
	private String tcEndDay;
	private Date lifeStartDate;
	private Date lifeEndDate;

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
}
