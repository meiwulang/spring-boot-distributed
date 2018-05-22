package com.jdy.b2b.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.common.constants.annotations.Delete;
import com.jdy.b2b.api.common.constants.annotations.Save;
import com.jdy.b2b.api.common.constants.annotations.Update;
import com.jdy.b2b.api.service.BrandService;
import com.jdy.b2b.api.vo.brand.BrandVO;

/**
 * @Description: 品牌控制层
 * @author 王斌
 * @date 2017年8月9日 上午10:05:52
 * @version V1.0
 */
@RestController
@RequestMapping(value = "brand")
public class BrandController {

	@Autowired
	private BrandService service;

	@PostMapping("/list")
	public ResultBean<?> list(@RequestBody BrandVO brand) {
		return service.list(brand);
	}

	@PostMapping("/toplist")
	public ResultBean<?> listForIndex(int size) {
		return service.listForIndex(size);
	}

	@PostMapping("/update")
	public ResultBean<?> update(
			@Validated(Update.class) @RequestBody BrandVO brand) {
		return service.update(brand);
	}

	@PostMapping("/delete")
	public ResultBean<?> delete(
			@Validated(Delete.class) @RequestBody BrandVO brand) {
		return service.delete(brand);
	}

	@PostMapping("/save")
	public ResultBean<?> save(
			@Validated(Save.class) @RequestBody BrandVO brand) {
		return service.save(brand);
	}
}
