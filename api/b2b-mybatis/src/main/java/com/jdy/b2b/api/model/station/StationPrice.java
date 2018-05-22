package com.jdy.b2b.api.model.station;

import com.jdy.b2b.api.model.product.BaseDO;

public class StationPrice extends BaseDO {
	private Integer spId;

	private String spName;

	private String spGoTime;

	private Integer spGoTimes;

	private String spType;

	private Integer spDateS;

	private Integer spDateE;

	private Integer spSaveTime;

	private Float spPrice;

	private Integer spStid;

	private String spStatus;

	private Integer spOrgId;

	private Integer spUId;

	private Float spSettlePrice;

	private Integer spSiteId;

	private String spSiteName;

	private Integer spPtype;

	private Integer spTimeLag;

	private String spGoBack;

	private String spTraffic;

	private String spStationType;

	private String spWeekly;

	public Integer getSpId() {
		return spId;
	}

	public void setSpId(Integer spId) {
		this.spId = spId;
	}

	public String getSpName() {
		return spName;
	}

	public void setSpName(String spName) {
		this.spName = spName == null ? null : spName.trim();
	}

	public String getSpGoTime() {
		return spGoTime;
	}

	public void setSpGoTime(String spGoTime) {
		this.spGoTime = spGoTime == null ? null : spGoTime.trim();
	}

	public Integer getSpGoTimes() {
		return spGoTimes;
	}

	public void setSpGoTimes(Integer spGoTimes) {
		this.spGoTimes = spGoTimes;
	}

	public String getSpType() {
		return spType;
	}

	public void setSpType(String spType) {
		this.spType = spType == null ? null : spType.trim();
	}

	public Integer getSpDateS() {
		return spDateS;
	}

	public void setSpDateS(Integer spDateS) {
		this.spDateS = spDateS;
	}

	public Integer getSpDateE() {
		return spDateE;
	}

	public void setSpDateE(Integer spDateE) {
		this.spDateE = spDateE;
	}

	public Integer getSpSaveTime() {
		return spSaveTime;
	}

	public void setSpSaveTime(Integer spSaveTime) {
		this.spSaveTime = spSaveTime;
	}

	public Float getSpPrice() {
		return spPrice;
	}

	public void setSpPrice(Float spPrice) {
		this.spPrice = spPrice;
	}

	public Integer getSpStid() {
		return spStid;
	}

	public void setSpStid(Integer spStid) {
		this.spStid = spStid;
	}

	public String getSpStatus() {
		return spStatus;
	}

	public void setSpStatus(String spStatus) {
		this.spStatus = spStatus == null ? null : spStatus.trim();
	}

	public Integer getSpOrgId() {
		return spOrgId;
	}

	public void setSpOrgId(Integer spOrgId) {
		this.spOrgId = spOrgId;
	}

	public Integer getSpUId() {
		return spUId;
	}

	public void setSpUId(Integer spUId) {
		this.spUId = spUId;
	}

	public Float getSpSettlePrice() {
		return spSettlePrice;
	}

	public void setSpSettlePrice(Float spSettlePrice) {
		this.spSettlePrice = spSettlePrice;
	}

	public Integer getSpSiteId() {
		return spSiteId;
	}

	public void setSpSiteId(Integer spSiteId) {
		this.spSiteId = spSiteId;
	}

	public String getSpSiteName() {
		return spSiteName;
	}

	public void setSpSiteName(String spSiteName) {
		this.spSiteName = spSiteName == null ? null : spSiteName.trim();
	}

	public Integer getSpPtype() {
		return spPtype;
	}

	public void setSpPtype(Integer spPtype) {
		this.spPtype = spPtype;
	}

	public Integer getSpTimeLag() {
		return spTimeLag;
	}

	public void setSpTimeLag(Integer spTimeLag) {
		this.spTimeLag = spTimeLag;
	}

	public String getSpGoBack() {
		return spGoBack;
	}

	public void setSpGoBack(String spGoBack) {
		this.spGoBack = spGoBack == null ? null : spGoBack.trim();
	}

	public String getSpTraffic() {
		return spTraffic;
	}

	public void setSpTraffic(String spTraffic) {
		this.spTraffic = spTraffic == null ? null : spTraffic.trim();
	}

	public String getSpStationType() {
		return spStationType;
	}

	public void setSpStationType(String spStationType) {
		this.spStationType = spStationType == null ? null
				: spStationType.trim();
	}

	public String getSpWeekly() {
		return spWeekly;
	}

	public void setSpWeekly(String spWeekly) {
		this.spWeekly = spWeekly == null ? null : spWeekly.trim();
	}
}