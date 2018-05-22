package com.jdy.b2b.api.model.product;

public class TripHotelDTO {

	private Long id;

	private Long companyId;

	private String hName;

	private String hShortName;

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

	public String gethName() {
		return hName;
	}

	public void sethName(String hName) {
		this.hName = hName;
	}

	public String gethShortName() {
		return hShortName;
	}

	public void sethShortName(String hShortName) {
		this.hShortName = hShortName;
	}

}