package com.jdy.b2b.api.model.synchronizeDistributionSystem;

import java.util.List;

import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

public class DeptDto extends Dept{
	
	private static final long serialVersionUID = 8641834026454413795L;
	
	private String tokenId;
	private String  childOrg;
	private List<DeptDto> children;

	//20180206新增
	private  String positionName;
	private Long positionId;
	private String employeeName;
	private Long employeeId;
	//20180206新增
	public List<DeptDto> getChildren() {
		return children;
	}

	public void setChildren(List<DeptDto> children) {
		this.children = children;
	}

	public String getTokenId() {
		return tokenId;
	}

	public void setTokenId(String tokenId) {
		this.tokenId = tokenId;
	}

	private List<Employee> employeeDtoList;
	
	public List<Employee> getEmployeeDtoList() {
		return employeeDtoList;
	}

	public void setEmployeeDtoList(List<Employee> employeeDtoList) {
		this.employeeDtoList = employeeDtoList;
	}

	@Override
	public String toString() {
		 return ReflectionToStringBuilder.toString(this, ToStringStyle.MULTI_LINE_STYLE);
	}
}
