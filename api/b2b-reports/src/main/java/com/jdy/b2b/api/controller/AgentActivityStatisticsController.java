package com.jdy.b2b.api.controller;

import com.alibaba.fastjson.JSONObject;
import com.jdy.b2b.api.common.JSONUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.reports.AgentActivityQueryDTO;
import com.jdy.b2b.api.service.AgentActivityStatisticsService;
import com.jdy.b2b.api.vo.AgentActivityQueryVO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * 代理人活跃度统计控制器
 * @author chris
 * @since Jan 07.18
 */
@RestController
@RequestMapping("agentActivityStatistics")
public class AgentActivityStatisticsController {

	private Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private AgentActivityStatisticsService agentActivityStatisticsService;

	@PostMapping("queryAgentActivityOfTotalCompany")
	public ResultBean<Map<String, Object>> queryAgentActivityOfTotalCompany(@RequestBody AgentActivityQueryVO vo) {
		AgentActivityQueryDTO param = JSONUtil.trans(vo, AgentActivityQueryDTO.class);
		setDataLimit(vo, param);
		Map<String, Object> resultMap = this.agentActivityStatisticsService.selectAgentActivityOfTotalCompany(param);
		return ResultBean.getSuccessResult(resultMap);
	}

	private void setDataLimit(@RequestBody AgentActivityQueryVO vo, AgentActivityQueryDTO param) {
		param.setDataLimit(vo.getPuDataLimit());
		switch (vo.getPuDataLimit()) {
			case 0: //用户级
				param.setDataValue(String.valueOf(vo.getPuserId()));
				break;
			case 1: //部门级
				param.setDataValue(String.valueOf(vo.getPuDepartmentId()));
				break;
			case 2: //单位级
				param.setDataValue(String.valueOf(vo.getPcompanyId()));
				break;
		}
	}

	@PostMapping("queryAgentActivityOfDeptByCompany")
	public ResultBean<Map<String, Object>> queryAgentActivityOfDeptByCompany(@RequestBody AgentActivityQueryVO vo) {
		AgentActivityQueryDTO param = JSONUtil.trans(vo, AgentActivityQueryDTO.class);
		setDataLimit(vo, param);
		if (StringUtils.isEmpty(vo.getCompanyId())) {
			return ResultBean.getErrorResult("公司ID不能为空!");
		}
		Map<String, Object> resultMap = this.agentActivityStatisticsService.selectAgentActivityOfDeptByCompany(param);
		return ResultBean.getSuccessResult(resultMap);
	}

	@PostMapping("queryAgentActivityOfSalesManagerByDept")
	public ResultBean<Map<String, Object>> queryAgentActivityOfSalesManagerByDept(@RequestBody AgentActivityQueryVO vo) {
		AgentActivityQueryDTO param = JSONUtil.trans(vo, AgentActivityQueryDTO.class);
		setDataLimit(vo, param);
		if (StringUtils.isEmpty(vo.getDeptId())) {
			return ResultBean.getErrorResult("部门ID不能为空!");
		}
		Map<String, Object> resultMap = this.agentActivityStatisticsService.selectAgentActivityOfSalesManagerByDept(param);
		return ResultBean.getSuccessResult(resultMap);
	}

	@PostMapping("queryAgentActivityOfSalesManagerByCompany")
	public ResultBean<Map<String, Object>> queryAgentActivityOfSalesManagerByCompany(@RequestBody AgentActivityQueryVO vo) {
		AgentActivityQueryDTO param = JSONUtil.trans(vo, AgentActivityQueryDTO.class);
		setDataLimit(vo, param);
		if (StringUtils.isEmpty(vo.getCompanyId())) {
			return ResultBean.getErrorResult("公司ID不能为空!");
		}
		Map<String, Object> resultMap = this.agentActivityStatisticsService.selectAgentActivityOfSalesManagerByCompany(param);
		return ResultBean.getSuccessResult(resultMap);
	}

	@PostMapping("queryAgentActivityBySalesManager")
	public ResultBean<Map<String, Object>> queryAgentActivityBySalesManager(@RequestBody AgentActivityQueryVO vo) {
		AgentActivityQueryDTO param = JSONUtil.trans(vo, AgentActivityQueryDTO.class);
		setDataLimit(vo, param);
		if (StringUtils.isEmpty(vo.getSalesManagerId())) {
			return ResultBean.getErrorResult("销售经理ID不能为空!");
		}
		Map<String, Object> resultMap = this.agentActivityStatisticsService.selectAgentActivityBySalesManager(param);
		return ResultBean.getSuccessResult(resultMap);
	}


}
