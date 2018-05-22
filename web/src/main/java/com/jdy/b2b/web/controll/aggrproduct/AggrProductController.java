package com.jdy.b2b.web.controll.aggrproduct;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.jdy.b2b.web.pojo.aggrproduct.AggrProduct;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

/**
 * @Description 集结产品控制层
 * @author 王斌
 * @date 2018年2月26日 下午3:05:49
 * @version V1.0
 */
@RestController
@RequestMapping("aggr")
@SuppressWarnings("unchecked")
@Api(description = "集结产品")
public class AggrProductController extends BaseController {

	/**
	 * @Description: 区域产品列表
	 * @author 王斌
	 * @date 2018年2月28日 下午11:14:44
	 * @return
	 */
	@ApiOperation("区域产品列表")
	@RequestMapping(method = RequestMethod.POST, value = "area-productlist")
	public ResultBean<Object> areaProductList(
			@RequestBody AggrProduct aggrProduct) {
		return restTemplate.postForObject(
				new StringBuilder(controllCenterUrl)
						.append("aggr/area-productlist").toString(),
				aggrProduct, ResultBean.class);
	}

	/**
	 * @Description: 集结产品列表
	 * @author 王斌
	 * @date 2018年2月26日 下午3:15:01
	 * @return
	 */
	@ApiOperation("集结产品列表")
	@RequestMapping(method = RequestMethod.POST, value = "local-productlist")
	public ResultBean<Object> localProductList(
			@RequestBody AggrProduct aggrProduct) {
		return restTemplate.postForObject(
				new StringBuilder(controllCenterUrl)
						.append("aggr/local-productlist").toString(),
				aggrProduct, ResultBean.class);
	}
	//
	// /**
	// * @Description: 创建集结产品
	// * @author 王斌
	// * @date 2018年2月26日 下午3:15:26
	// * @return
	// */
	// @RequestMapping(method = RequestMethod.POST, value = "create-product")
	// public ResultBean<Object> createProduct(AggrProduct aggrProduct) {
	// return aggrProductService.createProduct(aggrProduct);
	// }
	//
	// /**
	// * @Description: 创建本地产品
	// * @author 王斌
	// * @date 2018年2月26日 下午3:15:41
	// * @return
	// */
	// @RequestMapping(method = RequestMethod.POST, value =
	// "create-localproduct")
	// public ResultBean<Object> createLocalProduct(AggrProduct aggrProduct) {
	// return aggrProductService.createLocalProduct(aggrProduct);
	// }

}
