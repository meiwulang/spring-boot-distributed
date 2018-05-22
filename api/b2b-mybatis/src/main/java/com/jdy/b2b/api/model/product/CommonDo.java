package com.jdy.b2b.api.model.product;

import java.util.Date;

public class CommonDo {
	private Date createTime;

	private Long createUser;

	private Date updateTime;

	private Long updateUser;

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public Long getCreateUser() {
		return createUser;
	}

	public void setCreateUser(Long createUser) {
		this.createUser = createUser;
	}

	public Date getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}

	public Long getUpdateUser() {
		return updateUser;
	}

	public void setUpdateUser(Long updateUser) {
		this.updateUser = updateUser;
	}

	public void initCreateTime() {
		this.createTime = new Date();
	}

	public void initUpdateTime() {
		this.updateTime = new Date();
	}

	public void initCreatetimeAndUpdateTime() {
		this.createTime = new Date();
		this.updateTime = new Date();
	}
}
