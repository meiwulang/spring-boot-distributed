package com.jdy.b2b.api.model.product;

import java.util.Date;

public class ProductKeys {
	private Long id;

	private Long pkKeyId;

	private Long pkProductId;

	private Date createTime;

	private Long createUser;

	private Date updateTime;

	private Long updateUser;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getPkKeyId() {
		return pkKeyId;
	}

	public void setPkKeyId(Long pkKeyId) {
		this.pkKeyId = pkKeyId;
	}

	public Long getPkProductId() {
		return pkProductId;
	}

	public void setPkProductId(Long pkProductId) {
		this.pkProductId = pkProductId;
	}

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
}