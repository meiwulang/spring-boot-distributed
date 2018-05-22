package com.jdy.b2b.api.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.service.AgentInfoReportService;
import com.jdy.b2b.api.vo.AgentDetailInfoVO;
import com.jdy.b2b.api.vo.AgentInfoVO;

@RestController
@RequestMapping("agentinfo")
public class AgentInfoReportController {

	@Autowired
	AgentInfoReportService service;

	@PostMapping("list")
	public ResultBean<Map<String, Object>> list(@RequestBody AgentInfoVO vo) {
		return service.list(vo);

	}

	@PostMapping("detail")
	public ResultBean<Map<String, Object>> detail(
			@RequestBody AgentDetailInfoVO vo) {
		return service.detail(vo);

	}

	@PostMapping("sumdetail")
	public ResultBean<Map<String, Object>> sumDetail(
			@RequestBody AgentDetailInfoVO vo) {
		return service.sumDetail(vo);

	}

	@GetMapping("generateReport/{date}")
	public ResultBean<Map<String, Object>> generateReport(
			@PathVariable String date) {
		return service.geneSaleInfo(date);

	}

	@GetMapping("export")
	public ResultBean<Map<String, Object>> export(
			@RequestParam(value = "minDate") String minDate,
			@RequestParam(value = "maxDate") String maxDate,
			@RequestParam(value = "searchStr", required = false) String searchStr) {
		return service.export(minDate, maxDate, searchStr);

	}

}
