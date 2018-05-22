package com.jdy.b2b.web.pojo.distributionSystemEntity.login;

import java.io.Serializable;
import java.util.Date;

/**
 * <p>
 * 
 * </p>
 *
 * @author liuxiang
 * @since 2017-10-12
 */

public class OrgChart  implements Serializable{


	private static final long serialVersionUID = 88287139890061930L;
	private Integer cloudId;//云id

	private Long deptId;//分公司id

	private String deptName;//分公司名称

	private Long fDeptId;//上级组织id

	private String fDeptCode;//上级组织code

	private String fDeptName;//上级组织名称

	private Date startDt;

	private Date endDt;

	private Date updateDt;

	private Long updaterId;


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

	public Long getfDeptId() {
		return fDeptId;
	}

	public void setfDeptId(Long fDeptId) {
		this.fDeptId = fDeptId;
	}

	public String getfDeptName() {
		return fDeptName;
	}

	public void setfDeptName(String fDeptName) {
		this.fDeptName = fDeptName;
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

	protected Serializable pkVal() {
		return this.cloudId;
	}

	public String getfDeptCode() {
		return fDeptCode;
	}

	public void setfDeptCode(String fDeptCode) {
		this.fDeptCode = fDeptCode;
	}

	public String getDeptName() {
		return deptName;
	}

	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}

	@Override
	public String toString() {
		return "OrgChart{" +
			"cloudId=" + cloudId +
			", deptId=" + deptId +
			", fDeptId=" + fDeptId +
			", startDt=" + startDt +
			", endDt=" + endDt +
			", updateDt=" + updateDt +
			", updaterId=" + updaterId +
			"}";
	}
}
