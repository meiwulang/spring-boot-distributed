package com.jdy.b2b.api.model.slsms;

import java.util.Date;

import com.jdy.b2b.api.model.product.BaseDO;

public class SLsms extends BaseDO {
	private Long id;

	private String vCode;

	private String vPhone;

	private Integer vType;

	private Date createTime;
	private String v_md5;

	public String getV_md5() {
		return v_md5;
	}

	public void setV_md5(String v_md5) {
		this.v_md5 = v_md5;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getvCode() {
		return vCode;
	}

	public void setvCode(String vCode) {
		this.vCode = vCode == null ? null : vCode.trim();
	}

	public String getvPhone() {
		return vPhone;
	}

	public void setvPhone(String vPhone) {
		this.vPhone = vPhone == null ? null : vPhone.trim();
	}

	public Integer getvType() {
		return vType;
	}

	public void setvType(Integer vType) {
		this.vType = vType;
	}

	@Override
	public Date getCreateTime() {
		return createTime;
	}

	@Override
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
}