package com.jdy.b2b.api.model.agentinfo;

/**
 * @Description 代理人佣金
 * @author 王斌
 * @date 2017年10月20日 上午11:34:03
 * @version V1.0
 */
public class AgentInfoDTO {
	private String openId;
	private String realName;
	private String phone;
	private Integer followers;
	// private OrderInfoDTO orderInfo;
	private String minDate;
	private String maxDate;
	private String ids;
	private String id;
	private String orderCount;
	private String moneyCount;

	public String getOrderCount() {
		return orderCount;
	}

	public void setOrderCount(String orderCount) {
		this.orderCount = orderCount;
	}

	public String getMoneyCount() {
		return moneyCount;
	}

	public void setMoneyCount(String moneyCount) {
		this.moneyCount = new StringBuilder().append("￥").append(moneyCount)
				.toString();
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getIds() {
		return ids;
	}

	public void setIds(String ids) {
		this.ids = ids;
	}

	public String getMinDate() {
		return minDate;
	}

	public void setMinDate(String minDate) {
		this.minDate = minDate;
	}

	public String getMaxDate() {
		return maxDate;
	}

	public void setMaxDate(String maxDate) {
		this.maxDate = maxDate;
	}

	public String getOpenId() {
		return openId;
	}

	public void setOpenId(String openId) {
		this.openId = openId;
	}

	public String getRealName() {
		return realName;
	}

	public void setRealName(String realName) {
		this.realName = realName;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public Integer getFollowers() {
		return followers;
	}

	public void setFollowers(Integer followers) {

		this.followers = followers;
	}

	// public OrderInfoDTO getOrderInfo() {
	// return orderInfo;
	// }
	//
	// public void setOrderInfo(OrderInfoDTO orderInfo) {
	// this.orderInfo = orderInfo;
	// }

}
