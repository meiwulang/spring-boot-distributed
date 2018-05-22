package com.jdy.b2b.api.model.product;

public class ProductsDetail extends BaseDO {
	private Integer pdId;

	private Integer pdProductId;

	private String pdTitle;

	private String pdProductName;

	private Byte pdOrder;

	private Integer pdStartDate;

	private Integer pdEndDate;

	private Integer pdOperateTime;

	private Integer pdOldId;

	private String pdStatus;

	private Integer pdVersion;

	private String pdContent;

	public Integer getPdId() {
		return pdId;
	}

	public void setPdId(Integer pdId) {
		this.pdId = pdId;
	}

	public Integer getPdProductId() {
		return pdProductId;
	}

	public void setPdProductId(Integer pdProductId) {
		this.pdProductId = pdProductId;
	}

	public String getPdTitle() {
		return pdTitle;
	}

	public void setPdTitle(String pdTitle) {
		this.pdTitle = pdTitle == null ? null : pdTitle.trim();
	}

	public String getPdProductName() {
		return pdProductName;
	}

	public void setPdProductName(String pdProductName) {
		this.pdProductName = pdProductName == null ? null
				: pdProductName.trim();
	}

	public Byte getPdOrder() {
		return pdOrder;
	}

	public void setPdOrder(Byte pdOrder) {
		this.pdOrder = pdOrder;
	}

	public Integer getPdStartDate() {
		return pdStartDate;
	}

	public void setPdStartDate(Integer pdStartDate) {
		this.pdStartDate = pdStartDate;
	}

	public Integer getPdEndDate() {
		return pdEndDate;
	}

	public void setPdEndDate(Integer pdEndDate) {
		this.pdEndDate = pdEndDate;
	}

	public Integer getPdOperateTime() {
		return pdOperateTime;
	}

	public void setPdOperateTime(Integer pdOperateTime) {
		this.pdOperateTime = pdOperateTime;
	}

	public Integer getPdOldId() {
		return pdOldId;
	}

	public void setPdOldId(Integer pdOldId) {
		this.pdOldId = pdOldId;
	}

	public String getPdStatus() {
		return pdStatus;
	}

	public void setPdStatus(String pdStatus) {
		this.pdStatus = pdStatus == null ? null : pdStatus.trim();
	}

	public Integer getPdVersion() {
		return pdVersion;
	}

	public void setPdVersion(Integer pdVersion) {
		this.pdVersion = pdVersion;
	}

	public String getPdContent() {
		return pdContent;
	}

	public void setPdContent(String pdContent) {
		this.pdContent = pdContent == null ? null : pdContent.trim();
	}
}