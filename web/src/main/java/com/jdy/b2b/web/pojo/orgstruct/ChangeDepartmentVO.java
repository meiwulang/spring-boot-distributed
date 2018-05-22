package com.jdy.b2b.web.pojo.orgstruct;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

import com.jdy.b2b.web.util.BaseVO;

import io.swagger.annotations.ApiModelProperty;

/**
 * @Description 调整部门VO
 * @author 王斌
 * @date 2017年11月15日 上午11:45:25
 * @version V1.0
 */
public class ChangeDepartmentVO extends BaseVO {
	@ApiModelProperty("部门编号")
	@NotNull(message = "部门编号不能为空")
	private Long departmentId;
	@ApiModelProperty("父级部门编号")
	@NotNull(message = "父级部门编号不能为空")
	@Min(0)
	private Long pId;
	@ApiModelProperty("公司编号")
	@NotNull(message = "公司编号不能为空")
	private Long companyId;
	@ApiModelProperty("部门类型：0：销售，1非销售，2同业")
	@NotNull(message = "部门类型不能为空")
	private Integer dType;
	
	public Integer getdType() {
		return dType;
	}

	public void setdType(Integer dType) {
		this.dType = dType;
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
				+ pId + ", companyId=" + companyId + ", dType=" + dType + "]";
	}

}
