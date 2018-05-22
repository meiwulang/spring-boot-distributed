package com.jdy.b2b.api.vo.struct;

import javax.validation.constraints.NotNull;

import com.jdy.b2b.api.common.constants.annotations.EnumValue;

/**
 * @Description 调整组织名称VO
 * @author 王斌
 * @date 2017年11月15日 上午11:45:25
 * @version V1.0
 */
public class ChangeOrgNameVO {
	@NotNull(message = "组织编号不能为空")
	private Long id;
	@NotNull(message = "组织名称不能为空")
	private String name;
	@NotNull(message = "组织类型不能为空")
	@EnumValue(enums = { "0", "1" })
	private Integer type;
	protected Long userId;// 用户编号
	protected Long companyId;// 公司编号
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
