package com.jdy.b2b.api.vo.station;

import java.util.List;

import com.jdy.b2b.api.common.BaseVO;

/**
 * @Description 查询始发站列表ForTicketvo
 * @author 王斌
 * @date 2017年7月10日 上午9:53:24
 * @version V1.0
 */
public class QueryListForTicketVO extends BaseVO {
	private List<String> citys;
	private String dName;
	private Long companyId;
	private Integer dStatus = 0;
	private Integer dTraffic;

	public List<String> getCitys() {
		return citys;
	}

	public void setCitys(List<String> citys) {
		this.citys = citys;
	}

	public String getdName() {
		return dName;
	}

	public void setdName(String dName) {
		this.dName = dName;
	}

	public Long getCompanyId() {
		return companyId;
	}

	public void setCompanyId(Long companyId) {
		this.companyId = companyId;
	}

	public Integer getdStatus() {
		return dStatus;
	}

	public void setdStatus(Integer dStatus) {
		this.dStatus = dStatus;
	}

	public Integer getdTraffic() {
		return dTraffic;
	}

	public void setdTraffic(Integer dTraffic) {
		this.dTraffic = dTraffic;
	}

}
