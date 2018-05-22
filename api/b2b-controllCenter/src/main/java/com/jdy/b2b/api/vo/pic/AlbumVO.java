package com.jdy.b2b.api.vo.pic;

import java.util.Date;

import javax.validation.constraints.NotNull;

import com.jdy.b2b.api.common.BaseVO;
import com.jdy.b2b.api.common.constants.annotations.Delete;
import com.jdy.b2b.api.common.constants.annotations.EnumValue;
import com.jdy.b2b.api.common.constants.annotations.Query;
import com.jdy.b2b.api.common.constants.annotations.Save;
import com.jdy.b2b.api.common.constants.annotations.Update;

/**
 * @Description 保存图册
 * @author 王斌
 * @date 2017年7月18日 上午10:08:45
 * @version V1.0
 */
public class AlbumVO extends BaseVO {
	@NotNull(groups = { Update.class, Delete.class })
	private Long id;

	@NotNull(groups = { Save.class, Query.class, Update.class, Delete.class })
	private Long companyId;

	@NotNull(groups = { Save.class })
	private String aCity;
	@EnumValue(enums = { "0", "1" }, groups = Save.class)
	@NotNull(groups = { Save.class })
	private Integer aType;

	@NotNull(groups = { Save.class })
	private Long aPid;

	@NotNull(groups = { Save.class, Update.class })
	private String aName;
	@NotNull(groups = { Save.class, Update.class })
	private String pOssName;
	@NotNull(groups = { Save.class, Update.class })
	private Long pSize;
	private Integer aStatus = 0;

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

	public Long getCompanyId() {
		return companyId;
	}

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

	public String getpOssName() {
		return pOssName;
	}

	public void setpOssName(String pOssName) {
		this.pOssName = pOssName;
	}

	public Long getpSize() {
		return pSize;
	}

	public void setpSize(Long pSize) {
		this.pSize = pSize;
	}

}
