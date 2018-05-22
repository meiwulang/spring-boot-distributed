package com.jdy.b2b.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.service.DepartSlRportService;
import com.jdy.b2b.api.vo.DepartSaleReportVO;

/**
 * @Description 部门销售业绩统计报表
 * @author 王斌
 * @date 2017年11月9日 上午10:34:28
 * @version V1.0
 */
@RestController
public class DepartSlRportController {

	@Autowired
	private DepartSlRportService service;

	@PostMapping("department/sale/report")
	public ResultBean<Object> report(@RequestBody DepartSaleReportVO vo) {
		return service.report(vo);
	}
}
