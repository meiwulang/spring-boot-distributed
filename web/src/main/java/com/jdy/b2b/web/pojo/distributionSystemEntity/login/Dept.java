package com.jdy.b2b.web.pojo.distributionSystemEntity.login;


import org.apache.poi.ss.formula.functions.T;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * <p>
 * 
 * </p>
 *
 * @author liuxiang
 * @since 2017-10-12
 */
public class Dept implements Serializable{

	private static final long serialVersionUID = -3778838917824264519L;

	private Integer cloudId;//云ID

	private Long deptId;//部门id

	private String deptCode;//部门代码

	private String deptName;//部门名称

	private Integer isOrg;//是否业务组织 组织是1,部门是0

	private Integer isDeleted;

	private Integer isActive;

	private Date updateDt;

	private Long updaterId;//更新人ID

	private OrgChart orgChart;//上级组织

	private List<Position> positionList;

	private Integer orgHNo;

    private String tokenId;

    private String childOrg;

    private String children;

	private List<T>employeeDtoList;

	private Integer deptType;//1：销售部门  2：非销售部门

	private String employeeName;

	private String employeeId;

	private String positionName;

	private String positionId;

	private Integer isCompany;//0：非公司   1：公司

	private Integer cityNo;

	public Integer getCityNo() {
		return cityNo;
	}

	public void setCityNo(Integer cityNo) {
		this.cityNo = cityNo;
	}

	public Integer getCloudId() {
		return cloudId;
	}

	public void setCloudId(Integer cloudId) {
		this.cloudId = cloudId;
	}

	public Long getDeptId() {
		return deptId;
	}

	public void setDeptId(Long deptId) {
		this.deptId = deptId;
	}

	public String getDeptCode() {
		return deptCode;
	}

	public void setDeptCode(String deptCode) {
		this.deptCode = deptCode;
	}

	public String getDeptName() {
		return deptName;
	}

	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}

	public Integer getIsOrg() {
		return isOrg;
	}

	public void setIsOrg(Integer isOrg) {
		this.isOrg = isOrg;
	}

	public Integer getIsDeleted() {
		return isDeleted;
	}

	public void setIsDeleted(Integer isDeleted) {
		this.isDeleted = isDeleted;
	}
	
	public Integer getIsActive() {
		return isActive;
	}

	public void setIsActive(Integer isActive) {
		this.isActive = isActive;
	}

	public Date getUpdateDt() {
		return updateDt;
	}

	public void setUpdateDt(Date updateDt) {
		this.updateDt = updateDt;
	}

	public Long getUpdaterId() {
		return updaterId;
	}

	public void setUpdaterId(Long updaterId) {
		this.updaterId = updaterId;
	}

	public OrgChart getOrgChart() {
		return orgChart;
	}

	public void setOrgChart(OrgChart orgChart) {
		this.orgChart = orgChart;
	}

	public List<Position> getPositionList() {
		return positionList;
	}

	public void setPositionList(List<Position> positionList) {
		this.positionList = positionList;
	}
	
	public Integer getOrgHNo() {
		return orgHNo;
	}

	public void setOrgHNo(Integer orgHNo) {
		this.orgHNo = orgHNo;
	}

	protected Serializable pkVal() {
		return this.cloudId;
	}
	
	public interface CreateValidate{		
	}
	
	public interface ModifyValidate{		
	}
	
	public interface ListValidate{		
	}
	
	public interface DeleteValidate{		
	}

	public interface QueryByDeptId{		
	}
	
	public interface QueryByDeptName{		
	}
	
	@Override
	public String toString() {
		return "Dept{" +
			"cloudId=" + cloudId +
			", deptId=" + deptId +
			", deptCode=" + deptCode +
			", deptName=" + deptName +
			", isOrg=" + isOrg +
			", orgHNo=" + orgHNo +
			", isDeleted=" + isDeleted +
			", isActive=" + isActive +
			", updateDt=" + updateDt +
			", updaterId=" + updaterId +
			"}";
	}

	public String getTokenId() {
		return tokenId;
	}

	public void setTokenId(String tokenId) {
		this.tokenId = tokenId;
	}

	public String getChildOrg() {
		return childOrg;
	}

	public void setChildOrg(String childOrg) {
		this.childOrg = childOrg;
	}

	public String getChildren() {
		return children;
	}

	public void setChildren(String children) {
		this.children = children;
	}

	public List<T> getEmployeeDtoList() {
		return employeeDtoList;
	}

	public void setEmployeeDtoList(List<T> employeeDtoList) {
		this.employeeDtoList = employeeDtoList;
	}

	public Integer getDeptType() {
		return deptType;
	}

	public void setDeptType(Integer deptType) {
		this.deptType = deptType;
	}

	public String getEmployeeName() {
		return employeeName;
	}

	public void setEmployeeName(String employeeName) {
		this.employeeName = employeeName;
	}

	public String getEmployeeId() {
		return employeeId;
	}

	public void setEmployeeId(String employeeId) {
		this.employeeId = employeeId;
	}

	public String getPositionName() {
		return positionName;
	}

	public void setPositionName(String positionName) {
		this.positionName = positionName;
	}

	public String getPositionId() {
		return positionId;
	}

	public void setPositionId(String positionId) {
		this.positionId = positionId;
	}

	public Integer getIsCompany() {
		return isCompany;
	}

	public void setIsCompany(Integer isCompany) {
		this.isCompany = isCompany;
	}
}
