package com.jdy.b2b.api.model.brand;

import java.util.Date;

import com.jdy.b2b.api.model.product.BaseDO;

public class Brand extends BaseDO {
	private Integer id;

	private Long bCompanyId;

	private String bName;
	private String attachId;

	private String bIntroduction = "";

	private Integer bStatus;
	private Integer bDel;
	private Integer bSort;

	private Date createTime;

	private Long createUser;

	private Date updateTime;

	private Long updateUser;
	private String pOssName;

	public String getpOssName() {
		return pOssName;
	}

	public void setpOssName(String pOssName) {
		this.pOssName = pOssName;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Long getbCompanyId() {
		return bCompanyId;
	}

	public void setbCompanyId(Long bCompanyId) {
		this.bCompanyId = bCompanyId;
	}

	public String getbName() {
		return bName;
	}

	public void setbName(String bName) {
		this.bName = bName == null ? null : bName.trim();
	}

	public String getbIntroduction() {
		return bIntroduction;
	}

	public void setbIntroduction(String bIntroduction) {
		this.bIntroduction = bIntroduction == null ? null
				: bIntroduction.trim();
	}

	public Integer getbStatus() {
		return bStatus;
	}

	public void setbStatus(Integer bStatus) {
		this.bStatus = bStatus;
	}

	public Integer getbDel() {
		return bDel;
	}

	public void setbDel(Integer bDel) {
		this.bDel = bDel;
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

	public Integer getbSort() {
		return bSort;
	}

	public void setbSort(Integer bSort) {
		this.bSort = bSort;
	}

	private String companyName;
	private String createUserName;

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public String getCreateUserName() {
		return createUserName;
	}

	public void setCreateUserName(String createUserName) {
		this.createUserName = createUserName;
	}

	public String getAttachId() {
		return attachId;
	}

	public void setAttachId(String attachId) {
		this.attachId = attachId;
	}

}