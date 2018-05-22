package com.jdy.b2b.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.service.SMSService;
import com.jdy.b2b.api.vo.sms.SLsmsVO;

/**
 * @Description 验证码控制层
 * @author 王斌
 * @date 2017年9月22日 下午12:28:56
 * @version V1.0
 */
@RestController
@RequestMapping("slsms")
public class SLsmsController {
	@Autowired
	private SMSService service;

	@RequestMapping(value = "/save", method = RequestMethod.POST)
	public ResultBean<?> saveSmsInfo(@RequestBody SLsmsVO vo) {
		return service.save(vo);

	}

	@RequestMapping(value = "/query", method = RequestMethod.POST)
	public ResultBean<?> querySmsInfo(SLsmsVO vo) {
		return service.query(vo);
	}

	@RequestMapping(value = "/delete/{id}", method = RequestMethod.GET)
	public ResultBean<?> querySmsInfo(@PathVariable("id") Long id) {
		return service.delete(id);
	}
}
