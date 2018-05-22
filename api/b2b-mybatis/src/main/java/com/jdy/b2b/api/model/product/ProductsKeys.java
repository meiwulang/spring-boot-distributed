package com.jdy.b2b.api.model.product;

public class ProductsKeys extends BaseDO {
	private Integer pkId;

	private String pkName;

	private String pkColor;

	private String pkBgcolor;

	private String pkStatus;

	private String pkType;

	private Integer pkAddtime;

	private Integer pkOrgId;

	private Integer pkWgId;

	private Integer pkUid;

	public Integer getPkId() {
		return pkId;
	}

	public void setPkId(Integer pkId) {
		this.pkId = pkId;
	}

	public String getPkName() {
		return pkName;
	}

	public void setPkName(String pkName) {
		this.pkName = pkName == null ? null : pkName.trim();
	}

	public String getPkColor() {
		return pkColor;
	}

	public void setPkColor(String pkColor) {
		this.pkColor = pkColor == null ? null : pkColor.trim();
	}

	public String getPkBgcolor() {
		return pkBgcolor;
	}

	public void setPkBgcolor(String pkBgcolor) {
		this.pkBgcolor = pkBgcolor == null ? null : pkBgcolor.trim();
	}

	public String getPkStatus() {
		return pkStatus;
	}

	public void setPkStatus(String pkStatus) {
		this.pkStatus = pkStatus == null ? null : pkStatus.trim();
	}

	public String getPkType() {
		return pkType;
	}

	public void setPkType(String pkType) {
		this.pkType = pkType == null ? null : pkType.trim();
	}

	public Integer getPkAddtime() {
		return pkAddtime;
	}

	public void setPkAddtime(Integer pkAddtime) {
		this.pkAddtime = pkAddtime;
	}

	public Integer getPkOrgId() {
		return pkOrgId;
	}

	public void setPkOrgId(Integer pkOrgId) {
		this.pkOrgId = pkOrgId;
	}

	public Integer getPkWgId() {
		return pkWgId;
	}

	public void setPkWgId(Integer pkWgId) {
		this.pkWgId = pkWgId;
	}

	public Integer getPkUid() {
		return pkUid;
	}

	public void setPkUid(Integer pkUid) {
		this.pkUid = pkUid;
	}
}