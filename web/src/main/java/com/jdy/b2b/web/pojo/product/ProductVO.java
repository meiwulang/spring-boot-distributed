package com.jdy.b2b.web.pojo.product;

import com.jdy.b2b.web.annotation.EnumValue;
import com.jdy.b2b.web.util.BaseVO;
import com.jdy.b2b.web.util.annotations.Delete;
import com.jdy.b2b.web.util.annotations.Query;
import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;
import com.jdy.b2b.web.util.annotations.UpdateSingleField;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;
import org.hibernate.validator.constraints.URL;
import org.springframework.format.annotation.DateTimeFormat;

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
@ApiModel
public class 	ProductVO extends BaseVO {
	@NotNull(message = "产品主键为空", groups = { Update.class, Delete.class })
	@ApiModelProperty(value = "产品主键,update、delete必填")
	private Long id;
	@NotNull(message = "产品生命开始时间", groups = { Update.class, Save.class })
	@ApiModelProperty(value = "产品生命开始时间,update、save必填")
	private Date lifeStartDate;
	@NotNull(message = "产品生命结束时间", groups = { Update.class, Save.class })
	@ApiModelProperty(value = "产品生命结束时间,update、save必填")
	private Date lifeEndDate;
	@NotNull(message = "产品封面url不能为空", groups = { Save.class })
	@ApiModelProperty(value = "产品封面url,save必填")
	@URL(message = "产品封面路径格式不对")
	private String cover;
	@ApiModelProperty(value = "线路类型,可选值 0：默认线路，1：补充线路,save必填")
	@NotNull(groups = { Save.class }, message = "线路类型不能为空")
	@EnumValue(enums = { "0", "1" }, groups = Save.class, message = "线路类型可选值")
	private Integer lineType;
	// @NotNull(message = "公司编号不能为空", groups = { Save.class, Update.class,
	// Delete.class, Query.class })
	@ApiModelProperty(value = "公司编号", required = true)
	private Long companyId;

	@NotBlank(message = "产品编号不能为空", groups = { Save.class, Update.class })
	@Length(max = 20, groups = { Save.class, Update.class })
	@Pattern(regexp = "^[0-9a-zA-Z]{1,20}$", groups = { Save.class,
			Update.class }, message = "产品编号只能由1-20位英文字母和数字组成")
	@ApiModelProperty(value = "产品编号,save、update必填，长度限制", allowableValues = "1-20")
	private String pNo;

	@NotBlank(message = "产品名称不能为空", groups = { Save.class, Update.class })
	@Length(max = 50, groups = { Save.class, Update.class })
	@ApiModelProperty(value = "产品名称,save、update必填，长度限制", allowableValues = "1-50")
	private String pName;

	@Length(message = "产品简称长度范围0-20位", max = 20, groups = { Save.class,
			Update.class })
	@ApiModelProperty(value = "产品简称,save、update必填，长度限制")
	private String pShortName;

	@NotNull(message = "产品品牌编号不能为空", groups = { Save.class, Update.class })
	@ApiModelProperty(value = "产品品牌编号,save、update必填")
	private Integer pBrand;

	@NotNull(message = "产品类型编号不能为空", groups = { Save.class, Update.class })
	@ApiModelProperty(value = "产品类型编号,save、update必填，可选值", allowableValues = "10,11,20,30,40,50")
	private Integer pType;
	@Max(value = 999999999999L, message = "联系人编号最大值：999999999999", groups = {
			Save.class, Update.class })
	@ApiModelProperty(value = "产品联系人编号,save、update必填，大小范围")
	private Long pContacts;

	// @NotNull(groups = { Save.class, Update.class })
	// private Integer pDays;
	@Pattern(regexp = "^[0-9]{5,20}$|^\\s*$", message = "联系人qq应为5-20位数字组成", groups = {
			Save.class, Update.class })
	@ApiModelProperty(value = "产品联系人qq,save、update必填，数字长度范围5-20位")
	private String pQq;

	@Length(max = 20, groups = { Save.class, Update.class })
	@Pattern(message = "电话不合法", regexp = "(?:(\\(\\+?86\\))(0[0-9]{2,3}\\-?)?([2-9][0-9]{6,7})+(\\-[0-9]{1,4})?)|"
			+ "(?:(86-?)?(0[0-9]{2,3}\\-?)?([2-9][0-9]{6,7})+(\\-[0-9]{1,4})?)|"
			+ "^(1[34578]\\d{9})?$|^\\s*$", groups = { Save.class,
					Update.class })
	@ApiModelProperty(value = "产品联系人手机号,save、update必填，数字长度范围", allowableValues = "8-20")
	private String pPhone;
	@EnumValue(message = "推荐状态可选值,推荐 0:不推荐  1:推荐普通 2:推荐精选", enums = { "0", "1",
			"2" }, groups = { UpdateSingleField.class })
	@ApiModelProperty(value = "产品推荐状态,可选值 推荐 0:不推荐  1:推荐普通 2:推荐精选")
	private Byte pRecommend = 0;
	@EnumValue(message = "确认状态可选值", enums = { "0", "1" }, groups = {
			UpdateSingleField.class })
	@ApiModelProperty(value = "产品确认状态,可选值")
	private Byte pConfirm = 1;

	private Integer pStatus;
	private Integer pSort;

	@ApiModelProperty(value = "线路特色")
	private String pSpecial;

	@ApiModelProperty(value = "费用包含")
	private String pCostInclude;

	@ApiModelProperty(value = "费用不包含")
	private String pCostExclude;

	@ApiModelProperty(value = "预定须知")
	private String pNotes;

	@ApiModelProperty(value = "签证信息")
	private String pVisa;
	@ApiModelProperty(value = "来源 0:自营 1:非自营。新增、编辑必填")
	@EnumValue(enums = { "0", "1", "2", "3" ,"4" }, groups = { Save.class, Update.class })
	@NotNull(message = "来源不可为空", groups = { Save.class, Update.class })
	private Integer pFrom;
	@ApiModelProperty(value = "当来源为1时，必填。非自营来源名称")
	private String pFromName;
	@ApiModelProperty(value = "产品目的地。为团号的条件之一")
	private String pDestination;
	@ApiModelProperty(value = "产品目的地拼音码")
	private String pDestinationPym;
	@ApiModelProperty(value = "是否支持首付 0 不支持，1 ： 支持")
	@NotNull(message = "请选择是否支持首付", groups = { Save.class, Update.class })
	private Integer pPayWay;

	@ApiModelProperty(value = "首付款类型 1:固定金额(每人) 2:百分比(订单总额)")
	private Integer pFirstPayType;

	@ApiModelProperty(value = "首付百分比")
	private BigDecimal pPayAmount;
	@ApiModelProperty(value = "产品归属")
	private Byte ascription;
	private List<Long> assembleCompanyIds;
	@ApiModelProperty(value = "使用者类型：0产品：1销售/销售支持")
	@EnumValue(groups=Query.class,enums={"0","1"})
	private Integer isSaler=0;
	@ApiModelProperty(value = "在职员工")
	private String pStaff;
	@ApiModelProperty(value = "无业游民")
	private String pJobless;
	@ApiModelProperty(value = "在校学生")
	private String pStudent;
	@ApiModelProperty(value = "学前儿童")
	private String pPreschool;
	@ApiModelProperty(value = "自由职业者")
	private String pProfessional;
	@ApiModelProperty(value = "退休人员")
	private String pRetiree;
	@ApiModelProperty(value = "费用说明")
	private String pCostRemark;
	@ApiModelProperty(value = "目的地位置，0：国内，1国外")
	private Integer pDestinationLocation;
	@ApiModelProperty(value = "省/大洲")
	private String pDestinationRegion;
	@ApiModelProperty(value = "国家/城市")
	private String pDestinationArea;
	@ApiModelProperty(value = "产品经理英文")
	@NotNull(message = "产品经理英文", groups = { Save.class, Update.class })@Length(max = 20, groups = { Save.class, Update.class })
	private String pContactsEn;
	@ApiModelProperty(value = "创意总监中文")
	@NotNull(message = "创意总监中文", groups = { Save.class, Update.class })@Length(max = 20, groups = { Save.class, Update.class })
	private String pCreativeOfficerCn;
	@ApiModelProperty(value = "创意总监英文")
	@NotNull(message = "创意总监英文", groups = { Save.class, Update.class })@Length(max = 20, groups = { Save.class, Update.class })
	private String pCreativeOfficerEn;
	@ApiModelProperty(value = "主题中文")
	@NotNull(message = "主题中文", groups = { Save.class, Update.class })@Length(max = 100, groups = { Save.class, Update.class })
	private String pTopicCn;
	@NotNull(message = "主题英文", groups = { Save.class, Update.class })@Length(max = 100, groups = { Save.class, Update.class })
	@ApiModelProperty(value = "主题英文")
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

	public String getpDestinationPym() {
		return pDestinationPym;
	}

	public void setpDestinationPym(String pDestinationPym) {
		this.pDestinationPym = pDestinationPym;
	}

	public String getpDestination() {
		return pDestination;
	}

	public void setpDestination(String pDestination) {
		this.pDestination = pDestination;
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

	public Integer getpSort() {
		return pSort;
	}

	public void setpSort(Integer pSort) {
		this.pSort = pSort;
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

	public Integer getLineType() {
		return lineType;
	}

	public void setLineType(Integer lineType) {
		this.lineType = lineType;
	}

	@ApiModelProperty(value = "开始时间，格式yyyyMMdd,查询补充线路信息必填")
	@DateTimeFormat(pattern = "yyyyMMdd")
	private String tcStartDay;
	@ApiModelProperty(value = "结束时间，格式yyyyMMdd,查询补充线路信息必填")
	@DateTimeFormat(pattern = "yyyyMMdd")
	private String tcEndDay;

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
	private Long pGroup;
	
	public Long getpGroup() {
		return pGroup;
	}

	public void setpGroup(Long pGroup) {
		this.pGroup = pGroup;
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
