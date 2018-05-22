package com.jdy.b2b.api.controller;

import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.service.BrandService;

/**
 * @Description 门户品牌接口
 * @author 王斌
 * @date 2017年9月19日 上午10:54:39
 * @version V1.0
 */
@RestController
public class FrontBrandController {

	@Autowired
	BrandService brandService;

	@RequestMapping(value = "/b2b/business/boutiquelist", method = RequestMethod.GET)
	public ResultBean<?> boutiquelist(
			@RequestParam(name = "limit") Integer limit,
			@RequestParam(required = true, name = "city_code") String city_code) {

		if (Objects.isNull(limit) || limit < 1) {
			limit = 10000;
		}
		return brandService.listForIndex(limit);
	}
}
