package com.jdy.b2b.api.service;

import java.util.Map;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.vo.AgentDetailInfoVO;
import com.jdy.b2b.api.vo.AgentInfoVO;

/**
 * @Description 代理人信息业务层
 * @author 王斌
 * @date 2017年10月20日 下午12:52:52
 * @version V1.0
 */
public interface AgentInfoReportService {
	ResultBean<Map<String, Object>> export(String minDate, String maxDate,
			String searchStr);

	ResultBean<Map<String, Object>> list(AgentInfoVO vo);

	ResultBean<Map<String, Object>> detail(AgentDetailInfoVO vo);

	ResultBean<Map<String, Object>> sumDetail(AgentDetailInfoVO vo);

	ResultBean<Map<String, Object>> geneSaleInfo(String yesterday);
}
