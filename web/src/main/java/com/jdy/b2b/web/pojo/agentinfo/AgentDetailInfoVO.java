package com.jdy.b2b.web.pojo.agentinfo;

import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.format.annotation.DateTimeFormat;

import com.jdy.b2b.web.util.annotations.Query;
import com.jdy.b2b.web.util.annotations.Save;

/**
 * @Description 代理人销售详情vo
 * @author 王斌
 * @date 2017年10月20日 上午11:34:03
 * @version V1.0
 */
public class AgentDetailInfoVO {
	@DateTimeFormat(pattern = "yyyyMMdd")
	@NotEmpty(groups = { Query.class, Save.class }, message = "开始时间不能为空")
	private String minDate;
	@DateTimeFormat(pattern = "yyyyMMdd")
	@NotEmpty(groups = { Query.class, Save.class }, message = "结束时间不能为空")
	private String maxDate;
	@NotNull(groups = { Query.class }, message = "id不能为空")
	private Long id;

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

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

}
