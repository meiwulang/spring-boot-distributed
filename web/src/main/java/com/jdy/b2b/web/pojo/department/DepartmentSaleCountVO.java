package com.jdy.b2b.web.pojo.department;

import javax.validation.constraints.NotNull;

import com.jdy.b2b.web.annotation.EnumValue;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * Created by strict on 2017/11/9.
 */
@ApiModel
public class DepartmentSaleCountVO {
	/**
	 * 部门编码
	 */
	@ApiModelProperty(value = "部门id")
	private Long uDepartmentCode;
	/**
	 * 查询的时间 某年某月 yyyy-mm 或者是 某年某月某日 yyyy-mm-dd
	 */
	@ApiModelProperty(value = "查询的日，月统计、日统计期")
	private String queryDate;
	/**
	 * 查询的时间类型 0 没有 1 年月 2 年月日
	 */
	@ApiModelProperty(value = "统计类型,类型可选值[0，1，2，3，4，5].其中：0表示总计，1表示月统计，2表示日统计，3表示周统计，4表示季统计，5表示年统计", required = true)
	private Integer queryType;
	@ApiModelProperty(value = "查询开始日期，周统计、季统计、年统计需要传", required = false, hidden = false)
	private String startDate;
	@ApiModelProperty(value = "查询的日期，周统计、季统计、年统计需要传", required = false, hidden = false)
	private String endDate;
	@ApiModelProperty("统计对象,对象可选值[0，1，2].其中：0表示人员，1表示时间，2表示产品")
	@NotNull(message = "统计对象,对象可选值[0，1，2].其中：0表示人员，1表示时间，2表示产品")
	@EnumValue(enums = { "0", "1", "2" })
	private Integer objectType;
	@ApiModelProperty("开始时间（24小时制）,日统计具体时间段需要传，格式：HH:mm:ss,例如17:00:00、07:00:00")
	private String startTime;
	@ApiModelProperty(hidden = true)
	private Long companyId;
	@ApiModelProperty(hidden = true)
	private Long departmentId;
	private Long userId;
	private String groupConcat;

	public String getGroupConcat() {
		return groupConcat;
	}

	public void setGroupConcat(String groupConcat) {
		this.groupConcat = groupConcat;
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

	public String getStartDate() {
		return startDate;
	}

	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

	public String getEndDate() {
		return endDate;
	}

	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}

	public Long getuDepartmentCode() {
		return uDepartmentCode;
	}

	public void setuDepartmentCode(Long uDepartmentCode) {
		this.uDepartmentCode = uDepartmentCode;
	}

	public String getQueryDate() {
		return queryDate;
	}

	public void setQueryDate(String queryDate) {
		this.queryDate = queryDate;
	}

	public Integer getQueryType() {
		return queryType;
	}

	public void setQueryType(Integer queryType) {
		this.queryType = queryType;
	}
}
