package com.jdy.b2b.api.model.synchronizeDistributionSystem;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.jdy.b2b.api.model.position.Position;

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


	private static final long serialVersionUID = 7879306126476108931L;
	private Integer cloudId;//云ID
    
	private Long deptId;//	部门id


	private String deptCode; //部门代码


	private Integer deptType; //
	
	private String deptName;//部门名称
	
	private Integer isOrg;//是否业务组织


	private Integer isCompany;//是否分公司


	
	private Integer isDeleted;
	
	private Integer isActive;
	
	@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	private Date updateDt;
	
	private Long updaterId;//更新人ID
	
	private OrgChart orgChart;

	private OrgChart companyChart;

	private List<Position> positionList;
	
	private Integer orgHNo;

	private Long companyId;

	private Long parentId;

	public Integer getIsCompany() {
		return isCompany;
	}

	public void setIsCompany(Integer isCompany) {
		this.isCompany = isCompany;
	}

	public OrgChart getCompanyChart() {
		return companyChart;
	}

	public void setCompanyChart(OrgChart companyChart) {
		this.companyChart = companyChart;
	}

	public Long getCompanyId() {
		return companyId;
	}

	public void setCompanyId(Long companyId) {
		this.companyId = companyId;
	}

	public Long getParentId() {
		return parentId;
	}

	public void setParentId(Long parentId) {
		this.parentId = parentId;
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
}
