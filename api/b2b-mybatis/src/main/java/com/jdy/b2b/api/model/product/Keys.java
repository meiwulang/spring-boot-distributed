package com.jdy.b2b.api.model.product;

import java.util.Date;

import javax.validation.constraints.NotNull;

import com.jdy.b2b.api.common.constants.annotations.Delete;
import com.jdy.b2b.api.common.constants.annotations.Query;
import com.jdy.b2b.api.common.constants.annotations.Update;

public class Keys extends BaseDO {
	@NotNull(groups = { Update.class, Query.class, Delete.class })
	private Long id;

	@NotNull(groups = { Update.class, Query.class, Delete.class })
	private Long companyId;

	@NotNull(groups = Update.class)
	private String kName;

	@NotNull(groups = Update.class)
	private String kColor;

	private Date createTime;

	private Long createUser;

	private Date updateTime;

	private Long updateUser;

	private Integer status;
	private Integer lSort;

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@Override
	public Long getCompanyId() {
		return companyId;
	}

	@Override
	public void setCompanyId(Long companyId) {
		this.companyId = companyId;
	}

	public String getkName() {
		return kName;
	}

	public void setkName(String kName) {
		this.kName = kName == null ? null : kName.trim();
	}

	public String getkColor() {
		return kColor;
	}

	public void setkColor(String kColor) {
		this.kColor = kColor == null ? null : kColor.trim();
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

	public Integer getlSort() {
		return lSort;
	}

	public void setlSort(Integer lSort) {
		this.lSort = lSort;
	}

}