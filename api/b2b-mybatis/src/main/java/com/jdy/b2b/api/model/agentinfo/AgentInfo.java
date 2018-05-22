package com.jdy.b2b.api.model.agentinfo;

import com.jdy.b2b.api.model.product.BaseDO;

/**
 * @Description 代理人佣金
 * @author 王斌
 * @date 2017年10月20日 上午11:34:03
 * @version V1.0
 */
public class AgentInfo extends BaseDO {
	private String minDate;
	private String maxDate;
	private String searchStr;
	private String yesterday;

	public String getYesterday() {
		return yesterday;
	}

	public void setYesterday(String yesterday) {
		this.yesterday = yesterday;
	}

	public String getMinDate() {
		return minDate;
	}

	public void setMinDate(String minDate) {
		this.minDate = minDate;
	}

	public String getMaxDate() {
		return maxDate;
	}

	public void setMaxDate(String maxDate) {
		this.maxDate = maxDate;
	}

	public String getSearchStr() {
		return searchStr;
	}

	public void setSearchStr(String searchStr) {
		this.searchStr = searchStr;
	}

}
