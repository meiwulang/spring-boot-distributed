package com.jdy.b2b.api.model.station;

import java.util.Date;

import com.jdy.b2b.api.model.product.BaseDO;

public class DepartureDTO extends BaseDO {
	private Long id;

	private String dName;

	private Integer dType;

	private Integer dTraffic;

	private String dThree;

	private String dCountry;

	private String dProvince;

	private String dCity;

	private String dArea;

	private String dMapx;

	private String dMapy;
	private String pym;

	private Integer dStatus;
	private int goCount;
	private int backCount;

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

	public String getdName() {
		return dName;
	}

	public void setdName(String dName) {
		this.dName = dName == null ? null : dName.trim();
	}

	public Integer getdType() {
		return dType;
	}

	public void setdType(Integer dType) {
		this.dType = dType;
	}

	public Integer getdTraffic() {
		return dTraffic;
	}

	public void setdTraffic(Integer dTraffic) {
		this.dTraffic = dTraffic;
	}

	public String getdThree() {
		return dThree;
	}

	public void setdThree(String dThree) {
		this.dThree = dThree == null ? null : dThree.trim();
	}

	public String getdCountry() {
		return dCountry;
	}

	public void setdCountry(String dCountry) {
		this.dCountry = dCountry;
	}

	public String getdProvince() {
		return dProvince;
	}

	public void setdProvince(String dProvince) {
		this.dProvince = dProvince;
	}

	public String getdCity() {
		return dCity;
	}

	public void setdCity(String dCity) {
		this.dCity = dCity;
	}

	public String getdArea() {
		return dArea;
	}

	public void setdArea(String dArea) {
		this.dArea = dArea;
	}

	public String getdMapx() {
		return dMapx;
	}

	public void setdMapx(String dMapx) {
		this.dMapx = dMapx == null ? null : dMapx.trim();
	}

	public String getdMapy() {
		return dMapy;
	}

	public void setdMapy(String dMapy) {
		this.dMapy = dMapy == null ? null : dMapy.trim();
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

	public String getPym() {
		return pym;
	}

	public void setPym(String pym) {
		this.pym = pym;
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

	public int getGoCount() {
		return goCount;
	}

	public void setGoCount(int goCount) {
		this.goCount = goCount;
	}

	public int getBackCount() {
		return backCount;
	}

	public void setBackCount(int backCount) {
		this.backCount = backCount;
	}

}