package com.jdy.b2b.api.vo.struct;

import javax.validation.constraints.NotNull;

/**
 * @Description 创建部门VO
 * @author 王斌
 * @date 2017年11月15日 上午11:45:25
 * @version V1.0
 */
public class CreateDepartmentVO {
	@NotNull(message = "父级部门编号不能为空")
	private Long parentDepartmentId;
	@NotNull(message = "部门名称不能为空")
	private String departmentName;
	@NotNull(message = "公司编号不能为空")
	private Long companyId;
	private Long createUser;
	private Integer dType;
	private Long leader;

	public Long getLeader() {
		return leader;
	}

	public void setLeader(Long leader) {
		this.leader = leader;
	}

	public String getDepartmentName() {
		return departmentName;
	}

	public void setDepartmentName(String departmentName) {
		this.departmentName = departmentName;
	}

	public Integer getdType() {
		return dType;
	}

	public void setdType(Integer dType) {
		this.dType = dType;
	}

	public Long getParentDepartmentId() {
		return parentDepartmentId;
	}

	public void setParentDepartmentId(Long parentDepartmentId) {
		this.parentDepartmentId = parentDepartmentId;
	}


	public Long getCompanyId() {
		return companyId;
	}

	public void setCompanyId(Long companyId) {
		this.companyId = companyId;
	}

	public Long getCreateUser() {
		return createUser;
	}

	public void setCreateUser(Long createUser) {
		this.createUser = createUser;
	}

}
