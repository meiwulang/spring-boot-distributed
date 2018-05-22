package com.jdy.b2b.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.aggrproduct.AggrProduct;
import com.jdy.b2b.api.service.AggrProductService;

/**
 * @Description 集结产品控制层
 * @author 王斌
 * @date 2018年2月26日 下午3:05:49
 * @version V1.0
 */
@RestController
@RequestMapping("aggr")
public class AggrProductController {

	@Autowired
	private AggrProductService aggrProductService;

	/**
	 * @Description: 区域产品列表
	 * @author 王斌
	 * @date 2018年2月26日 下午3:14:44
	 * @return
	 */
	@RequestMapping(method = RequestMethod.POST, value = "area-productlist")
	public ResultBean<Object> areaProductList(
			@RequestBody AggrProduct aggrProduct) {
		return aggrProductService.areaProductList(aggrProduct);
	}

	/**
	 * @Description: 集结产品列表
	 * @author 王斌
	 * @date 2018年2月26日 下午3:15:01
	 * @return
	 */
	@RequestMapping(method = RequestMethod.POST, value = "local-productlist")
	public ResultBean<Object> localProductList(
			@RequestBody AggrProduct aggrProduct) {
		return aggrProductService.localProductList(aggrProduct);
	}

	/**
	 * @Description: 创建集结产品
	 * @author 王斌
	 * @date 2018年2月26日 下午3:15:26
	 * @return
	 */
	@RequestMapping(method = RequestMethod.POST, value = "create-product")
	public ResultBean<Object> createProduct(
			@RequestBody AggrProduct aggrProduct) {
		return aggrProductService.createProduct(aggrProduct);
	}

	/**
	 * @Description: 创建本地产品
	 * @author 王斌
	 * @date 2018年2月26日 下午3:15:41
	 * @return
	 */
	@RequestMapping(method = RequestMethod.POST, value = "create-localproduct")
	public ResultBean<Object> createLocalProduct(
			@RequestBody AggrProduct aggrProduct) {
		return aggrProductService.createLocalProduct(aggrProduct);
	}

}
