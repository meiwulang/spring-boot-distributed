package com.jdy.b2b.api.model.synchronizeDistributionSystem;



import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * <p>
 *  职位实体
 * </p>
 *
 * @author wangyunliang
 * @since 2017-10-12
 */

public class PositionDto<T>  implements Serializable{

	private static final long serialVersionUID = -9196242718427205412L;
	private Integer cloudId;

	private Long positionId;

	private Long deptId;

	private Long departmentId;

	private Long companyId;

	private String positionCode;//职务id

	private String positionName;//职位名称

    private String positionDesc;//职位描述

	private Integer isActive;//是否启用

    private Integer isDeleted;

	private Date updateDt;

	private Date createDt;

	private Long creatorId;

	private Long updaterId;

	private Long fPositionId;

	private String fPositionName;

	private Integer isManager;

	private Integer positionLevel;

   private Integer authType;

	private String deptName;

	private String childPosition;

	private Date startDt;

    private Date endDt;

	private Long roleId;

	private Long employeeId;

	private String roleName;

	private String roleDesc;

	private Integer roleStatus;

	private String employeeName;

	private List<T> positionIdList;

	private List<T> roleIdList;

	private List<T> employeeIdList;

	private String children;

	private String tokenId;

	private Integer positionHNo;

	private Long orgId;

	private String  orgHNo;

	private Integer isMainPosition;

	private String firstLetter;

	private Boolean select;

	private Integer positionType;//职务类型 1：销售岗位 2：非销售岗位

	private String updater;//修改者

	private String creator;//创建者

	private String shortName;

	public String getShortName() {
		return shortName;
	}

	public void setShortName(String shortName) {
		this.shortName = shortName;
	}

	public Long getDepartmentId() {
		return departmentId;
	}

	public void setDepartmentId(Long departmentId) {
		this.departmentId = departmentId;
	}

	public Long getCompanyId() {
		return companyId;
	}

	public void setCompanyId(Long companyId) {
		this.companyId = companyId;
	}

	public Integer getIsActive() {
        return isActive;
    }

    public void setIsActive(Integer isActive) {
        this.isActive = isActive;
    }

    public Integer getCloudId() {
		return cloudId;
	}

	public void setCloudId(Integer cloudId) {
		this.cloudId = cloudId;
	}

	public Long getPositionId() {
		return positionId;
	}

	public void setPositionId(Long positionId) {
		this.positionId = positionId;
	}

	public Long getDeptId() {
		return deptId;
	}

	public void setDeptId(Long deptId) {
		this.deptId = deptId;
	}

	public String getPositionCode() {
		return positionCode;
	}

	public void setPositionCode(String positionCode) {
		this.positionCode = positionCode;
	}

	public String getPositionName() {
		return positionName;
	}

	public void setPositionName(String positionName) {
		this.positionName = positionName;
	}

	public Integer getIsDeleted() {
		return isDeleted;
	}

	public void setIsDeleted(Integer isDeleted) {
		this.isDeleted = isDeleted;
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

    public String getPositionDesc() {
        return positionDesc;
    }

    public void setPositionDesc(String positionDesc) {
        this.positionDesc = positionDesc;
    }



	protected Serializable pkVal() {
		return this.cloudId;
	}

	@Override
	public String toString() {
		return "Position{" +
			"cloudId=" + cloudId +
			", positionId=" + positionId +
			", deptId=" + deptId +
			", positionCode=" + positionCode +
			", positionName=" + positionName +
			", positionDesc=" + positionDesc +
			", isDeleted=" + isDeleted +
			", updateDt=" + updateDt +
			", updaterId=" + updaterId +
			"}";
	}

	public Date getCreateDt() {
		return createDt;
	}

	public void setCreateDt(Date createDt) {
		this.createDt = createDt;
	}

	public Long getCreatorId() {
		return creatorId;
	}

	public void setCreatorId(Long creatorId) {
		this.creatorId = creatorId;
	}

	public Long getfPositionId() {
		return fPositionId;
	}

	public void setfPositionId(Long fPositionId) {
		this.fPositionId = fPositionId;
	}

	public String getfPositionName() {
		return fPositionName;
	}

	public void setfPositionName(String fPositionName) {
		this.fPositionName = fPositionName;
	}

	public List<T> getRoleIdList() {
		return roleIdList;
	}

	public void setRoleIdList(List<T> roleIdList) {
		this.roleIdList = roleIdList;
	}

	public List<T> getEmployeeIdList() {
		return employeeIdList;
	}

	public void setEmployeeIdList(List<T> employeeIdList) {
		this.employeeIdList = employeeIdList;
	}

	public String getChildren() {
		return children;
	}

	public void setChildren(String children) {
		this.children = children;
	}

	public String getTokenId() {
		return tokenId;
	}

	public void setTokenId(String tokenId) {
		this.tokenId = tokenId;
	}

	public Integer getPositionHNo() {
		return positionHNo;
	}

	public void setPositionHNo(Integer positionHNo) {
		this.positionHNo = positionHNo;
	}

	public Long getOrgId() {
		return orgId;
	}

	public void setOrgId(Long orgId) {
		this.orgId = orgId;
	}

	public String getOrgHNo() {
		return orgHNo;
	}

	public void setOrgHNo(String orgHNo) {
		this.orgHNo = orgHNo;
	}

	public Integer getIsMainPosition() {
		return isMainPosition;
	}

	public void setIsMainPosition(Integer isMainPosition) {
		this.isMainPosition = isMainPosition;
	}

	public String getFirstLetter() {
		return firstLetter;
	}

	public void setFirstLetter(String firstLetter) {
		this.firstLetter = firstLetter;
	}

	public Boolean getSelect() {
		return select;
	}

	public void setSelect(Boolean select) {
		this.select = select;
	}

	public Integer getIsManager() {
		return isManager;
	}

	public void setIsManager(Integer isManager) {
		this.isManager = isManager;
	}

	public Integer getPositionLevel() {
		return positionLevel;
	}

	public void setPositionLevel(Integer positionLevel) {
		this.positionLevel = positionLevel;
	}

	public Integer getAuthType() {
		return authType;
	}

	public void setAuthType(Integer authType) {
		this.authType = authType;
	}

	public String getDeptName() {
		return deptName;
	}

	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}

	public String getChildPosition() {
		return childPosition;
	}

	public void setChildPosition(String childPosition) {
		this.childPosition = childPosition;
	}

	public Date getStartDt() {
		return startDt;
	}

	public void setStartDt(Date startDt) {
		this.startDt = startDt;
	}

	public Date getEndDt() {
		return endDt;
	}

	public void setEndDt(Date endDt) {
		this.endDt = endDt;
	}

	public Long getRoleId() {
		return roleId;
	}

	public void setRoleId(Long roleId) {
		this.roleId = roleId;
	}

	public Long getEmployeeId() {
		return employeeId;
	}

	public void setEmployeeId(Long employeeId) {
		this.employeeId = employeeId;
	}

	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	public String getRoleDesc() {
		return roleDesc;
	}

	public void setRoleDesc(String roleDesc) {
		this.roleDesc = roleDesc;
	}

	public Integer getRoleStatus() {
		return roleStatus;
	}

	public void setRoleStatus(Integer roleStatus) {
		this.roleStatus = roleStatus;
	}

	public String getEmployeeName() {
		return employeeName;
	}

	public void setEmployeeName(String employeeName) {
		this.employeeName = employeeName;
	}

	public List<T> getPositionIdList() {
		return positionIdList;
	}

	public void setPositionIdList(List<T> positionIdList) {
		this.positionIdList = positionIdList;
	}

	public Integer getPositionType() {
		return positionType;
	}

	public void setPositionType(Integer positionType) {
		this.positionType = positionType;
	}

	public String getUpdater() {
		return updater;
	}

	public void setUpdater(String updater) {
		this.updater = updater;
	}

	public String getCreator() {
		return creator;
	}

	public void setCreator(String creator) {
		this.creator = creator;
	}
}
