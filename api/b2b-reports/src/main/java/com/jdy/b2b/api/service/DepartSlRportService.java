package com.jdy.b2b.api.service;

import org.springframework.web.bind.annotation.RequestBody;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.vo.DepartSaleReportVO;

/**
 * @author 王斌
 * @date 2017年11月10日 上午11:08:48
 * @version V1.0
 */
public interface DepartSlRportService {
	ResultBean<Object> report(@RequestBody DepartSaleReportVO vo);
}
