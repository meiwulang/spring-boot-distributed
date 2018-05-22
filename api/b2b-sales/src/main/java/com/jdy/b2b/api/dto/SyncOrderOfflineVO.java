package com.jdy.b2b.api.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by yangcheng on 2018/3/7.
 */
public class SyncOrderOfflineVO {
	private Long userId;
	private String orderNo;
	private Integer fStatus;
	private String auditDesc;
	private List<Long> payId = new ArrayList<>();

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getOrderNo() {
		return orderNo;
	}

	public void setOrderNo(String orderNo) {
		this.orderNo = orderNo;
	}

	public Integer getfStatus() {
		return fStatus;
	}

	public void setfStatus(Integer fStatus) {
		this.fStatus = fStatus;
	}

	public String getAuditDesc() {
		return auditDesc;
	}

	public void setAuditDesc(String auditDesc) {
		this.auditDesc = auditDesc;
	}

	public List<Long> getPayId() {
		return payId;
	}

	public void setPayId(List<Long> payId) {
		this.payId = payId;
	}

	@Override
	public String toString() {
		return "SyncOrderOfflineVO {\"userId\":\"" + userId
				+ "\", \"orderNo\":\"" + orderNo + "\", \"fStatus\":\""
				+ fStatus + "\", \"auditDesc\":\"" + auditDesc
				+ "\", \"payId\":\"" + payId + "\"}";
	}

}
