package com.jdy.b2b.web.pojo.distributionSystemEntity.login;

/**
 * Created by dugq on 2018/3/23.
 */
public class OpenIdLoginRequstion {
	private Long cloudId;
	private String wxOpenId;

	public OpenIdLoginRequstion() {
	}

	public OpenIdLoginRequstion(Long cloudId, String wxOpenId) {
		this.cloudId = cloudId;
		this.wxOpenId = wxOpenId;
	}

	public Long getCloudId() {
		return cloudId;
	}

	public void setCloudId(Long cloudId) {
		this.cloudId = cloudId;
	}

	public String getWxOpenId() {
		return wxOpenId;
	}

	public void setWxOpenId(String wxOpenId) {
		this.wxOpenId = wxOpenId;
	}

	@Override
	public String toString() {
		return "OpenIdLoginRequstion [cloudId=" + cloudId + ", wxOpenId="
				+ wxOpenId + "]";
	}

}
