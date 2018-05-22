package com.jdy.b2b.api.vo.station;

import com.jdy.b2b.api.common.BaseVO;

/**
 * @Description 查询始发站列表vo
 * @author 王斌
 * @date 2017年7月10日 上午9:53:24
 * @version V1.0
 */
public class QueryStationStartListVO extends BaseVO {

	private String sdName;
	private String sdCity;
	private String sdStatus = "ok";
	private String sdOrgId;
	private String sdStartType;

	public String getSdName() {
		return sdName;
	}

	public void setSdName(String sdName) {
		this.sdName = sdName;
	}

	public String getSdCity() {
		return sdCity;
	}

	public void setSdCity(String sdCity) {
		this.sdCity = sdCity;
	}

	public String getSdStatus() {
		return sdStatus;
	}

	public void setSdStatus(String sdStatus) {
		this.sdStatus = sdStatus;
	}

	public String getSdOrgId() {
		return sdOrgId;
	}

	public void setSdOrgId(String sdOrgId) {
		this.sdOrgId = sdOrgId;
	}

	public String getSdStartType() {
		return sdStartType;
	}

	public void setSdStartType(String sdStartType) {
		this.sdStartType = sdStartType;
	}

}
