package com.jdy.b2b.api.model.product;

public class TripScenicDTO {

	private Long id;

	private Long companyId;

	private String sName;

	private String sShortName;

	private String sCountry;

	private String sProvince;

	private String sCity;

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

	public String getsName() {
		return sName;
	}

	public void setsName(String sName) {
		this.sName = sName;
	}

	public String getsShortName() {
		return sShortName;
	}

	public void setsShortName(String sShortName) {
		this.sShortName = sShortName;
	}

	public String getsCountry() {
		return sCountry;
	}

	public void setsCountry(String sCountry) {
		this.sCountry = sCountry;
	}

	public String getsProvince() {
		return sProvince;
	}

	public void setsProvince(String sProvince) {
		this.sProvince = sProvince;
	}

	public String getsCity() {
		return sCity;
	}

	public void setsCity(String sCity) {
		this.sCity = sCity;
	}

}