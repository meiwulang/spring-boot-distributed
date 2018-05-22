package com.jdy.b2b.api.model.product;

import java.util.Date;

public class TripHotel extends BaseDO {
	private Long id;

	private Long phTripId;

	private Long phHotelId;
	private Long phPid;

	private Integer phTripType;

	private Date createTime;

	private Long createUser;

	private Date updateTime;

	private Long updateUser;

	public Long getPhPid() {
		return phPid;
	}

	public void setPhPid(Long phPid) {
		this.phPid = phPid;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getPhTripId() {
		return phTripId;
	}

	public void setPhTripId(Long phTripId) {
		this.phTripId = phTripId;
	}

	public Long getPhHotelId() {
		return phHotelId;
	}

	public void setPhHotelId(Long phHotelId) {
		this.phHotelId = phHotelId;
	}

	public Integer getPhTripType() {
		return phTripType;
	}

	public void setPhTripType(Integer phTripType) {
		this.phTripType = phTripType;
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

	public void initUpdateTime() {
		this.updateTime = new Date();
	}

	public void initCreatetimeAndUpdateTime() {
		this.createTime = new Date();
		this.updateTime = new Date();
	}
}