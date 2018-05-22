package com.jdy.b2b.api.vo.struct;

import javax.validation.constraints.NotNull;

import com.jdy.b2b.api.common.constants.annotations.EnumValue;

/**
 * @Description 修改负责人VO
 * @author 王斌
 * @date 2017年11月15日 上午11:45:25
 * @version V1.0
 */
public class SetManagerVO {
	@NotNull(message = "组织编号不能为空")
	private Long orgId;
	@NotNull(message = "组织类型不能为空")
	@EnumValue(enums = { "0,1" })
	private Integer type;
	@NotNull(message = "负责人编号不能为空")
	private Long userId;
	// @NotEmpty(message = "负责人名称不能为空")
	// private String userName;
	@NotNull(message = "操作人编号不能为空")
	private Long updateUser;
	private Long companyId;
	private Long managerId;

	// public String getUserName() {
	// return userName;
	// }
	//
	// public void setUserName(String userName) {
	// this.userName = userName;
	// }

	public Long getManagerId() {
		return managerId;
	}

	public void setManagerId(Long managerId) {
		this.managerId = managerId;
	}

	public Long getCompanyId() {
		return companyId;
	}

	public void setCompanyId(Long companyId) {
		this.companyId = companyId;
	}

	public Long getOrgId() {
		return orgId;
	}

	public void setOrgId(Long orgId) {
		this.orgId = orgId;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public Long getUpdateUser() {
		return updateUser;
	}

	public void setUpdateUser(Long updateUser) {
		this.updateUser = updateUser;
	}

}
