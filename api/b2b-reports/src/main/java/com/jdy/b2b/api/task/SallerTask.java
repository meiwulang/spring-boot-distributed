package com.jdy.b2b.api.task;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.jdy.b2b.api.service.AgentInfoReportService;

/**
 * @Description 代理人销售报表
 * @author 王斌
 * @date 2017年10月30日 下午5:51:43
 * @version V1.0
 */
@Component
public class SallerTask {
	@Autowired
	AgentInfoReportService service;

	@Scheduled(cron = "0 0 1 * * ?")
	public void doTask() {
		service.geneSaleInfo(null);
	}
}
