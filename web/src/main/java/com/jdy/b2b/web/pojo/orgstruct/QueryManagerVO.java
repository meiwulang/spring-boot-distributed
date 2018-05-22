package com.jdy.b2b.web.pojo.orgstruct;

import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModelProperty;

/**
 * @Description 获取领导列表VO
 * @author 王斌
 * @date 2017年11月15日 上午11:45:25
 * @version V1.0
 */
public class QueryManagerVO {
	@NotNull(message = "公司编号不能为空")
	@ApiModelProperty("公司编号")
	private Long companyId;
	private Long departmentId;
	@ApiModelProperty("领导名称")
	private String name;

	public Long getCompanyId() {
		return companyId;
	}

	public void setCompanyId(Long companyId) {
		this.companyId = companyId;
	}

	public Long getDepartmentId() {
		return departmentId;
	}

	public void setDepartmentId(Long departmentId) {
		this.departmentId = departmentId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}
