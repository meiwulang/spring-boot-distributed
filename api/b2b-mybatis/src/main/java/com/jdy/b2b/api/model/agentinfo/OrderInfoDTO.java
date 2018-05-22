package com.jdy.b2b.api.model.agentinfo;

/**
 * @Description 代理人佣金
 * @author 王斌
 * @date 2017年10月20日 上午11:34:03
 * @version V1.0
 */
public class OrderInfoDTO {
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

}
