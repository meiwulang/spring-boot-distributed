package com.jdy.b2b.api.model;

public class OrderTouristForCS extends OrderTourist {

	private String otTicketName;
	private String otLeaveName;
	private String otReturnName;

	private String categoryName;
	private String ticketTypeName;
	private String ticketName;

	public String getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}

	public String getTicketTypeName() {
		return ticketTypeName;
	}

	public void setTicketTypeName(String ticketTypeName) {
		this.ticketTypeName = ticketTypeName;
	}

	public String getTicketName() {
		return ticketName;
	}

	public void setTicketName(String ticketName) {
		this.ticketName = ticketName;
	}

	public String getOtTicketName() {
		return otTicketName;
	}

	public void setOtTicketName(String otTicketName) {
		this.otTicketName = otTicketName;
	}

	public String getOtLeaveName() {
		return otLeaveName;
	}

	public void setOtLeaveName(String otLeaveName) {
		this.otLeaveName = otLeaveName;
	}

	public String getOtReturnName() {
		return otReturnName;
	}

	public void setOtReturnName(String otReturnName) {
		this.otReturnName = otReturnName;
	}

	@Override
	public String toString() {
		return "OrderTouristForCS {otTicketName:" + otTicketName
				+ ", otLeaveName:" + otLeaveName + ", otReturnName:"
				+ otReturnName + ", categoryName:"
				+ categoryName + ", ticketTypeName:"
				+ ticketTypeName + ", ticketName:"
				+ ticketName + "}" + super.toString();
	}

}