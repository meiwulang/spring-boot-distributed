package com.jdy.b2b.api.model.station;

import com.jdy.b2b.api.model.product.BaseDO;

public class Station extends BaseDO {
	private Integer stId;

	private String stName;

	private String stPym;

	private String stType;

	private String stProvince;

	private String stCity;

	private String stCounty;

	private Integer stOrgId;

	private String stSiteName;

	private Integer stOrder;

	private String stStatus;

	private Integer stTime;

	private Integer stUId;

	public Integer getStId() {
		return stId;
	}

	public void setStId(Integer stId) {
		this.stId = stId;
	}

	public String getStName() {
		return stName;
	}

	public void setStName(String stName) {
		this.stName = stName == null ? null : stName.trim();
	}

	public String getStPym() {
		return stPym;
	}

	public void setStPym(String stPym) {
		this.stPym = stPym == null ? null : stPym.trim();
	}

	public String getStType() {
		return stType;
	}

	public void setStType(String stType) {
		this.stType = stType == null ? null : stType.trim();
	}

	public String getStProvince() {
		return stProvince;
	}

	public void setStProvince(String stProvince) {
		this.stProvince = stProvince == null ? null : stProvince.trim();
	}

	public String getStCity() {
		return stCity;
	}

	public void setStCity(String stCity) {
		this.stCity = stCity == null ? null : stCity.trim();
	}

	public String getStCounty() {
		return stCounty;
	}

	public void setStCounty(String stCounty) {
		this.stCounty = stCounty == null ? null : stCounty.trim();
	}

	public Integer getStOrgId() {
		return stOrgId;
	}

	public void setStOrgId(Integer stOrgId) {
		this.stOrgId = stOrgId;
	}

	public String getStSiteName() {
		return stSiteName;
	}

	public void setStSiteName(String stSiteName) {
		this.stSiteName = stSiteName == null ? null : stSiteName.trim();
	}

	public Integer getStOrder() {
		return stOrder;
	}

	public void setStOrder(Integer stOrder) {
		this.stOrder = stOrder;
	}

	public String getStStatus() {
		return stStatus;
	}

	public void setStStatus(String stStatus) {
		this.stStatus = stStatus == null ? null : stStatus.trim();
	}

	public Integer getStTime() {
		return stTime;
	}

	public void setStTime(Integer stTime) {
		this.stTime = stTime;
	}

	public Integer getStUId() {
		return stUId;
	}

	public void setStUId(Integer stUId) {
		this.stUId = stUId;
	}
}