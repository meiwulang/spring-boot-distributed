package com.jdy.b2b.web.pojo.orgstruct;

import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModelProperty;

/**
 * @Description 创建子公司VO
 * @author 王斌
 * @date 2017年11月15日 上午11:45:25
 * @version V1.0
 */
public class CreateCompanyVO {
	@NotNull(message = "父级公司编号不能为空")
	@ApiModelProperty("父级公司编号，一级子公司父级编号为0")
	private Long parentCompanyId;
	@NotNull(message = "公司名称不能为空")
	@ApiModelProperty("公司名称")
	private String companyName;
	@ApiModelProperty(hidden = true)
	protected Long userId;// 用户编号

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public Long getParentCompanyId() {
		return parentCompanyId;
	}

	public void setParentCompanyId(Long parentCompanyId) {
		this.parentCompanyId = parentCompanyId;
	}

}
