package com.jdy.b2b.api.model.product;

import java.util.Date;

public class ProductExtends {
	private Long id;

	private Long tProductId;
	private String tcStartDay;
	private String tcEndDay;
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

	public Long gettProductId() {
		return tProductId;
	}

	public void settProductId(Long tProductId) {
		this.tProductId = tProductId;
	}

	public String getTcStartDay() {
		return tcStartDay;
	}

	public void setTcStartDay(String tcStartDay) {
		this.tcStartDay = tcStartDay;
	}

	public String getTcEndDay() {
		return tcEndDay;
	}

	public void setTcEndDay(String tcEndDay) {
		this.tcEndDay = tcEndDay;
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