package com.jdy.b2b.api.model.department.report;

import java.util.List;

/**
 * @Description 部门销售业绩统计报表DO
 * @author 王斌
 * @date 2017年11月9日 上午10:23:58
 * @version V1.0
 */
public class DepartSaleReportDO {
	private int type;
	private String date;
	private String endDate;
	private Long dCode;
	private List<Long> dIds;
	private Long companyId;
	private Long departmentId;
	private Long userId;
	private Long productId;

	public Long getProductId() {
		return productId;
	}

	public void setProductId(Long productId) {
		this.productId = productId;
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

	public List<Long> getdIds() {
		return dIds;
	}

	public void setdIds(List<Long> dIds) {
		this.dIds = dIds;
	}

	public String getEndDate() {
		return endDate;
	}

	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}

	public Long getdCode() {
		return dCode;
	}

	public void setdCode(Long dCode) {
		this.dCode = dCode;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

}