package com.jdy.b2b.api.model.agentinfo;

import java.util.Date;

/**
 * @Description 代理人佣金
 * @author 王斌
 * @date 2017年10月20日 上午11:34:03
 * @version V1.0
 */
public class UserOrderInfoDTO {
	private Long userId;
	private String day;
	private String num;
	private String orders;
	private String amount;
	private Date createTime;

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getDay() {
		return day;
	}

	public void setDay(String day) {
		this.day = day;
	}

	public String getNum() {
		return num;
	}

	public void setNum(String num) {
		this.num = num;
	}

	public String getOrders() {
		return orders;
	}

	public void setOrders(String orders) {
		this.orders = orders;
	}

	public String getAmount() {
		return amount;
	}

	public void setAmount(String amount) {
		this.amount = amount;
	}

}
