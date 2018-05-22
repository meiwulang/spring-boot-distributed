package com.jdy.b2b.web.pojo.orgstruct;

import javax.validation.constraints.NotNull;

import com.jdy.b2b.web.annotation.EnumValue;

import io.swagger.annotations.ApiModelProperty;

/**
 * @Description 调整组织名称VO
 * @author 王斌
 * @date 2017年11月15日 上午11:45:25
 * @version V1.0
 */
public class ChangeOrgNameVO {
	@NotNull(message = "组织编号不能为空")
	@ApiModelProperty("组织编号,即公司或部门编号")
	private Long id;
	@NotNull(message = "组织名称不能为空")
	@ApiModelProperty("组织名称,即公司或部门名称")
	private String name;
	@NotNull(message = "组织类型不能为空")
	@ApiModelProperty("组织类型，公司：0，部门：1")
	@EnumValue(enums = { "0", "1" })
	private Integer type;
	@ApiModelProperty(hidden = true)
	protected Long userId;// 用户编号
	@ApiModelProperty("公司编号")
	protected Long companyId;
	private Integer dType;
	
	public Integer getdType() {
		return dType;
	}

	public void setdType(Integer dType) {
		this.dType = dType;
	}
	public Long getCompanyId() {
		return companyId;
	}

	public void setCompanyId(Long companyId) {
		this.companyId = companyId;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

}
