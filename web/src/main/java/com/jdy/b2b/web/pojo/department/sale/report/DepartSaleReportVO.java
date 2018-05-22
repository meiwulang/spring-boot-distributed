package com.jdy.b2b.web.pojo.department.sale.report;

import javax.validation.constraints.NotNull;

import com.jdy.b2b.web.annotation.EnumValue;

import io.swagger.annotations.ApiModelProperty;

/**
 * @Description 部门销售业绩统计报表vo
 * @author 王斌
 * @date 2017年11月9日 上午10:23:58
 * @version V1.0
 */
public class DepartSaleReportVO {
	@ApiModelProperty("统计类型,类型可选值[0，1，2，3，4，5].其中：0表示总计，1表示月统计，2表示日统计，3表示周统计，4表示季统计，5表示年统计")
	@NotNull(message = "统计类型,类型可选值[0，1，2，3，4，5].其中：0表示总计，1表示月统计，2表示日统计，3表示周统计，4表示季统计，5表示年统计")
	@EnumValue(enums = { "0", "1", "2", "3", "4", "5" })
	private Integer type;
	@ApiModelProperty("统计对象,对象可选值[0，1].其中：0表示部门，1表示时间")
	// @NotNull(message = "统计对象,对象可选值[0，1].其中：0表示部门，1表示时间")
	// @EnumValue(enums = { "0", "1" })
	private Integer objectType;
	@ApiModelProperty("统计时间，在月统计、日统计、周统计、季统计、年统计需要传（周统计中表示开始时间）。时间格式：yyyy-MM-dd,如：2007-01-01")
	private String date;
	@ApiModelProperty("统计结束时间，在周统计、季统计需要传。时间格式：yyyy-MM-dd,如：2007-01-02")
	private String endDate;
	@ApiModelProperty("开始时间（24小时制）,日统计具体时间段需要传，格式：HH:mm:ss,例如17:00:00、07:00:00")
	private String startTime;
	@ApiModelProperty("公司编号")
	private Long companyId;
	@ApiModelProperty(hidden = true)
	private Long departmentId;
	@ApiModelProperty(hidden = true)
	private Long userId;
	
	@ApiModelProperty("产品编号")
	private Long productId;

	public Long getProductId() {
		return productId;
	}

	public void setProductId(Long productId) {
		this.productId = productId;
	}
	public Long getDepartmentId() {
		return departmentId;
	}

	public void setDepartmentId(Long departmentId) {
		this.departmentId = departmentId;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public Long getCompanyId() {
		return companyId;
	}

	public void setCompanyId(Long companyId) {
		this.companyId = companyId;
	}

	public String getStartTime() {
		return startTime;
	}

	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}

	public Integer getObjectType() {
		return objectType;
	}

	public void setObjectType(Integer objectType) {
		this.objectType = objectType;
	}

	public String getEndDate() {
		return endDate;
	}

	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

}
