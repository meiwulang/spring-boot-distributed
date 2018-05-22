package com.jdy.b2b.web.pojo.orgstruct;

import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModelProperty;

/**
 * @Description 创建部门VO
 * @author 王斌
 * @date 2017年11月15日 上午11:45:25
 * @version V1.0
 */
public class CreateDepartmentVO {
	@NotNull(message = "父级部门编号不能为空")
	@ApiModelProperty("父级部门编号，一级部门父级编号为0")
	private Long parentDepartmentId;
	@NotNull(message = "部门名称不能为空")
	@ApiModelProperty("部门名称")
	private String departmentName;
	@NotNull(message = "公司编号不能为空")
	@ApiModelProperty("公司编号")
	private Long companyId;
	@ApiModelProperty(hidden = true)
	private Long createUser;
	private Long leader;
	@ApiModelProperty("部门类型：0：销售，1非销售，2同业")
	@NotNull(message = "部门类型不能为空")
	private Integer dType;
	
	public Integer getdType() {
		return dType;
	}

	public void setdType(Integer dType) {
		this.dType = dType;
	}
	public Long getLeader() {
		return leader;
	}

	public void setLeader(Long leader) {
		this.leader = leader;
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

	public Long getParentDepartmentId() {
		return parentDepartmentId;
	}

	public void setParentDepartmentId(Long parentDepartmentId) {
		this.parentDepartmentId = parentDepartmentId;
	}

	public String getDepartmentName() {
		return departmentName;
	}

	public void setDepartmentName(String departmentName) {
		this.departmentName = departmentName;
	}

}
