package com.jdy.b2b.api.model;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jdy.b2b.api.model.product.BaseDO;

public class Department extends BaseDO {
	@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	private  Date endDate;
	@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	private  Date startDate;

	private Long id;

	private Long companyId;

	private Long dPid;

	private String dNo;

	private String dName;

	private String dPhone;

	private String dFax;

	private String dIntroduce;

	private Long dCode;

	private Integer dLevel;

	private Integer dStatus;

	private Integer dType;

	private Long leader;

	private String leaderName;

	private Date createTime;

	private Long createUser;
	@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	private Date updateTime;

	private Long updateUser;

	public String getLeaderName() {
		return leaderName;
	}

	public void setLeaderName(String leaderName) {
		this.leaderName = leaderName;
	}

	public Long getLeader() {
		return leader;
	}

	public void setLeader(Long leader) {
		this.leader = leader;
	}


	public Integer getdType() {
		return dType;
	}

	public void setdType(Integer dType) {
		this.dType = dType;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getdPid() {
		return dPid;
	}

	public void setdPid(Long dPid) {
		this.dPid = dPid;
	}

	@Override
	public Long getCompanyId() {
		return companyId;
	}

	@Override
	public void setCompanyId(Long companyId) {
		this.companyId = companyId;
	}

	public String getdNo() {
		return dNo;
	}

	public void setdNo(String dNo) {
		this.dNo = dNo == null ? null : dNo.trim();
	}

	public String getdName() {
		return dName;
	}

	public void setdName(String dName) {
		this.dName = dName == null ? null : dName.trim();
	}

	public String getdPhone() {
		return dPhone;
	}

	public void setdPhone(String dPhone) {
		this.dPhone = dPhone == null ? null : dPhone.trim();
	}

	public String getdFax() {
		return dFax;
	}

	public void setdFax(String dFax) {
		this.dFax = dFax == null ? null : dFax.trim();
	}

	public Long getdCode() {
		return dCode;
	}

	public void setdCode(Long dCode) {
		this.dCode = dCode;
	}

	public Integer getdLevel() {
		return dLevel;
	}

	public void setdLevel(Integer dLevel) {
		this.dLevel = dLevel;
	}

	public String getdIntroduce() {
		return dIntroduce;
	}

	public void setdIntroduce(String dIntroduce) {
		this.dIntroduce = dIntroduce == null ? null : dIntroduce.trim();
	}

	public Integer getdStatus() {
		return dStatus;
	}

	public void setdStatus(Integer dStatus) {
		this.dStatus = dStatus;
	}

	@Override
	public Date getCreateTime() {
		return createTime;
	}

	@Override
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	@Override
	public Long getCreateUser() {
		return createUser;
	}

	@Override
	public void setCreateUser(Long createUser) {
		this.createUser = createUser;
	}

	@Override
	public Date getUpdateTime() {
		return updateTime;
	}

	@Override
	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}

	@Override
	public Long getUpdateUser() {
		return updateUser;
	}

	@Override
	public void setUpdateUser(Long updateUser) {
		this.updateUser = updateUser;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}
}