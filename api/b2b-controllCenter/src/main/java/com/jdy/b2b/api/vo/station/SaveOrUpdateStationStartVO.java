package com.jdy.b2b.api.vo.station;

import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Length;

import com.jdy.b2b.api.common.BaseVO;

/**
 * @Description 保存或编辑始发站
 * @author 王斌
 * @date 2017年7月10日 上午9:50:16
 * @version V1.0
 */
public class SaveOrUpdateStationStartVO extends BaseVO {
	private Integer sdId;
	@Length(max = 20)
	private String sdName;

	private String sdPym;

	private String sdType = "始发站";

	private String sdStartType;

	private String sdProvince;

	private String sdCity;

	private String sdCounty;

	private String sdStatus;
	@NotNull
	private Integer sdOrgId;

	private Integer sdTime;

	@NotNull
	private Integer sdUId;

	private String sdMapx;

	private String sdMapy;

	private String sdMapz;

	private String sdLogo;

	private String sdCode;

	public Integer getSdId() {
		return sdId;
	}

	public void setSdId(Integer sdId) {
		this.sdId = sdId;
	}

	public String getSdName() {
		return sdName;
	}

	public void setSdName(String sdName) {
		this.sdName = sdName == null ? null : sdName.trim();
	}

	public String getSdPym() {
		return sdPym;
	}

	public void setSdPym(String sdPym) {
		this.sdPym = sdPym == null ? null : sdPym.trim();
	}

	public String getSdType() {
		return sdType;
	}

	public void setSdType(String sdType) {
		this.sdType = sdType == null ? null : sdType.trim();
	}

	public String getSdStartType() {
		return sdStartType;
	}

	public void setSdStartType(String sdStartType) {
		this.sdStartType = sdStartType == null ? null : sdStartType.trim();
	}

	public String getSdProvince() {
		return sdProvince;
	}

	public void setSdProvince(String sdProvince) {
		this.sdProvince = sdProvince == null ? null : sdProvince.trim();
	}

	public String getSdCity() {
		return sdCity;
	}

	public void setSdCity(String sdCity) {
		this.sdCity = sdCity == null ? null : sdCity.trim();
	}

	public String getSdCounty() {
		return sdCounty;
	}

	public void setSdCounty(String sdCounty) {
		this.sdCounty = sdCounty == null ? null : sdCounty.trim();
	}

	public String getSdStatus() {
		return sdStatus;
	}

	public void setSdStatus(String sdStatus) {
		this.sdStatus = sdStatus == null ? null : sdStatus.trim();
	}

	public Integer getSdOrgId() {
		return sdOrgId;
	}

	public void setSdOrgId(Integer sdOrgId) {
		this.sdOrgId = sdOrgId;
	}

	public Integer getSdTime() {
		return sdTime;
	}

	public void setSdTime(Integer sdTime) {
		this.sdTime = sdTime;
	}

	public Integer getSdUId() {
		return sdUId;
	}

	public void setSdUId(Integer sdUId) {
		this.sdUId = sdUId;
	}

	public String getSdMapx() {
		return sdMapx;
	}

	public void setSdMapx(String sdMapx) {
		this.sdMapx = sdMapx == null ? null : sdMapx.trim();
	}

	public String getSdMapy() {
		return sdMapy;
	}

	public void setSdMapy(String sdMapy) {
		this.sdMapy = sdMapy == null ? null : sdMapy.trim();
	}

	public String getSdMapz() {
		return sdMapz;
	}

	public void setSdMapz(String sdMapz) {
		this.sdMapz = sdMapz == null ? null : sdMapz.trim();
	}

	public String getSdLogo() {
		return sdLogo;
	}

	public void setSdLogo(String sdLogo) {
		this.sdLogo = sdLogo == null ? null : sdLogo.trim();
	}

	public String getSdCode() {
		return sdCode;
	}

	public void setSdCode(String sdCode) {
		this.sdCode = sdCode == null ? null : sdCode.trim();
	}
}
