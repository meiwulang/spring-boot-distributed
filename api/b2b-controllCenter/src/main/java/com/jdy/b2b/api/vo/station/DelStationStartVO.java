package com.jdy.b2b.api.vo.station;

import javax.validation.constraints.NotNull;

import com.jdy.b2b.api.common.BaseVO;

/**
 * @Description 删除始发站
 * @author 王斌
 * @date 2017年7月10日 上午9:50:16
 * @version V1.0
 */
public class DelStationStartVO extends BaseVO {
	@NotNull
	private Integer sdId;
	@NotNull
	private Integer sdOrgId;
	@NotNull
	private Integer sdUId;

	public Integer getSdId() {
		return sdId;
	}

	public void setSdId(Integer sdId) {
		this.sdId = sdId;
	}

	public Integer getSdOrgId() {
		return sdOrgId;
	}

	public void setSdOrgId(Integer sdOrgId) {
		this.sdOrgId = sdOrgId;
	}

	public Integer getSdUId() {
		return sdUId;
	}

	public void setSdUId(Integer sdUId) {
		this.sdUId = sdUId;
	}

}
