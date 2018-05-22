package com.jdy.b2b.api.model.pic;

import java.util.Date;
import java.util.List;

import com.jdy.b2b.api.model.product.BaseDO;

public class Attach extends BaseDO {
	private transient List<Long> userIds;
	private Long id;

	private Integer pType;

	private Long pPid;

	private Long pAlbumId;

	private String pRealName;

	private String pOssName;

	private Long pSize;

	private String pPicType;

	private Date createTime;

	private Long createUser;

	private Date updateTime;

	private Long updateUser;

	public List<Long> getUserIds() {
		return userIds;
	}

	public void setUserIds(List<Long> userIds) {
		this.userIds = userIds;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Integer getpType() {
		return pType;
	}

	public void setpType(Integer pType) {
		this.pType = pType;
	}

	public Long getpPid() {
		return pPid;
	}

	public void setpPid(Long pPid) {
		this.pPid = pPid;
	}

	public Long getpAlbumId() {
		return pAlbumId;
	}

	public void setpAlbumId(Long pAlbumId) {
		this.pAlbumId = pAlbumId;
	}

	public String getpRealName() {
		return pRealName;
	}

	public void setpRealName(String pRealName) {
		this.pRealName = pRealName == null ? null : pRealName.trim();
	}

	public String getpOssName() {
		return pOssName;
	}

	public void setpOssName(String pOssName) {
		this.pOssName = pOssName == null ? null : pOssName.trim();
	}

	public Long getpSize() {
		return pSize;
	}

	public void setpSize(Long pSize) {
		this.pSize = pSize;
	}

	public String getpPicType() {
		return pPicType;
	}

	public void setpPicType(String pPicType) {
		this.pPicType = pPicType == null ? null : pPicType.trim();
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
}