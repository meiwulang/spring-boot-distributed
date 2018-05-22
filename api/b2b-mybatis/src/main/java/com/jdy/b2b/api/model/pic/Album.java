package com.jdy.b2b.api.model.pic;

import java.util.Date;

import com.jdy.b2b.api.model.product.BaseDO;

public class Album extends BaseDO {
	private AlbumExt albumExt;
	private Long id;

	private Long companyId;

	private String aCity;

	private Integer aType;

	private Long aPid;

	private String aName;

	private Integer aStatus;

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

	@Override
	public Long getCompanyId() {
		return companyId;
	}

	@Override
	public void setCompanyId(Long companyId) {
		this.companyId = companyId;
	}

	public String getaCity() {
		return aCity;
	}

	public void setaCity(String aCity) {
		this.aCity = aCity == null ? null : aCity.trim();
	}

	public Integer getaType() {
		return aType;
	}

	public void setaType(Integer aType) {
		this.aType = aType;
	}

	public Long getaPid() {
		return aPid;
	}

	public void setaPid(Long aPid) {
		this.aPid = aPid;
	}

	public String getaName() {
		return aName;
	}

	public void setaName(String aName) {
		this.aName = aName == null ? null : aName.trim();
	}

	public Integer getaStatus() {
		return aStatus;
	}

	public void setaStatus(Integer aStatus) {
		this.aStatus = aStatus;
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

	public AlbumExt getAlbumExt() {
		return albumExt;
	}

	public void setAlbumExt(AlbumExt albumExt) {
		this.albumExt = albumExt;
	}

}