package com.jdy.b2b.api.vo.struct;

import javax.validation.constraints.NotNull;

/**
 * @Description 调整部门VO
 * @author 王斌
 * @date 2017年11月15日 上午11:45:25
 * @version V1.0
 */
public class ChangeDepartmentVO {
	@NotNull(message = "部门编号不能为空")
	private Long departmentId;
	@NotNull(message = "父级部门编号不能为空")
	private Long pId;
	@NotNull(message = "公司编号不能为空")
	private Long companyId;
	private Long userId;// 用户编号
	private Integer dType;
	
	public Integer getdType() {
		return dType;
	}

	public void setdType(Integer dType) {
		this.dType = dType;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public Long getDepartmentId() {
		return departmentId;
	}

	public void setDepartmentId(Long departmentId) {
		this.departmentId = departmentId;
	}

	public Long getpId() {
		return pId;
	}

	public void setpId(Long pId) {
		this.pId = pId;
	}

	public Long getCompanyId() {
		return companyId;
	}

	public void setCompanyId(Long companyId) {
		this.companyId = companyId;
	}

	@Override
	public String toString() {
		return "ChangeDepartmentVO [departmentId=" + departmentId + ", pId="
				+ pId + ", companyId=" + companyId + ", userId=" + userId
				+ ", dType=" + dType + "]";
	}

}
