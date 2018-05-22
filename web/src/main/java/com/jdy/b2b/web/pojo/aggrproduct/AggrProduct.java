package com.jdy.b2b.web.pojo.aggrproduct;

import com.jdy.b2b.web.util.BaseVO;

/**
 * @Description 集结产品实体
 * @author 王斌
 * @date 2018年2月27日 上午11:11:43
 * @version V1.0
 */
public class AggrProduct extends BaseVO {
	private Integer pType;
	private Long companyId;
	private String pName;
	private String startStation;
	private Integer pStatus;

	public Integer getpStatus() {
		return pStatus;
	}

	public void setpStatus(Integer pStatus) {
		this.pStatus = pStatus;
	}

	public Integer getpType() {
		return pType;
	}

	public void setpType(Integer pType) {
		this.pType = pType;
	}

	public Long getCompanyId() {
		return companyId;
	}

	public void setCompanyId(Long companyId) {
		this.companyId = companyId;
	}

	public String getpName() {
		return pName;
	}

	public void setpName(String pName) {
		this.pName = pName;
	}

	public String getStartStation() {
		return startStation;
	}

	public void setStartStation(String startStation) {
		this.startStation = startStation;
	}

}
