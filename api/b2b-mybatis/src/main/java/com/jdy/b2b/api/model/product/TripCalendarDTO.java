package com.jdy.b2b.api.model.product;

public class TripCalendarDTO {
	private Long id;

	private Long tProductId;

	private Long phTripId;

	private String tcStartDay;
	private String tcEndDay;

	public String getTcStartDay() {
		return tcStartDay;
	}

	public void setTcStartDay(String tcStartDay) {
		this.tcStartDay = tcStartDay;
	}

	public String getTcEndDay() {
		return tcEndDay;
	}

	public void setTcEndDay(String tcEndDay) {
		this.tcEndDay = tcEndDay;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long gettProductId() {
		return tProductId;
	}

	public void settProductId(Long tProductId) {
		this.tProductId = tProductId;
	}

	public Long getPhTripId() {
		return phTripId;
	}

	public void setPhTripId(Long phTripId) {
		this.phTripId = phTripId;
	}

}