package com.jdy.b2b.api.model.product;

public class CompanyBrand extends BaseDO {
	private Integer cbId;

	private String cbName;

	private String cbBrief;

	private String cbLogoUrl;

	private Short cbSort;

	private Integer cbOrgId;

	private Integer cbUId;

	private Boolean cbShow;

	private String cbDel;

	private Integer cbTime;

	public Integer getCbId() {
		return cbId;
	}

	public void setCbId(Integer cbId) {
		this.cbId = cbId;
	}

	public String getCbName() {
		return cbName;
	}

	public void setCbName(String cbName) {
		this.cbName = cbName == null ? null : cbName.trim();
	}

	public String getCbBrief() {
		return cbBrief;
	}

	public void setCbBrief(String cbBrief) {
		this.cbBrief = cbBrief == null ? null : cbBrief.trim();
	}

	public String getCbLogoUrl() {
		return cbLogoUrl;
	}

	public void setCbLogoUrl(String cbLogoUrl) {
		this.cbLogoUrl = cbLogoUrl == null ? null : cbLogoUrl.trim();
	}

	public Short getCbSort() {
		return cbSort;
	}

	public void setCbSort(Short cbSort) {
		this.cbSort = cbSort;
	}

	public Integer getCbOrgId() {
		return cbOrgId;
	}

	public void setCbOrgId(Integer cbOrgId) {
		this.cbOrgId = cbOrgId;
	}

	public Integer getCbUId() {
		return cbUId;
	}

	public void setCbUId(Integer cbUId) {
		this.cbUId = cbUId;
	}

	public Boolean getCbShow() {
		return cbShow;
	}

	public void setCbShow(Boolean cbShow) {
		this.cbShow = cbShow;
	}

	public String getCbDel() {
		return cbDel;
	}

	public void setCbDel(String cbDel) {
		this.cbDel = cbDel == null ? null : cbDel.trim();
	}

	public Integer getCbTime() {
		return cbTime;
	}

	public void setCbTime(Integer cbTime) {
		this.cbTime = cbTime;
	}
}