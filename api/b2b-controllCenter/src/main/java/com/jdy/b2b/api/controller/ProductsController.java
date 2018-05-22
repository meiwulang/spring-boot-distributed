package com.jdy.b2b.api.controller;

import java.util.LinkedHashMap;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.jdy.b2b.api.common.BaseVO;
import com.jdy.b2b.api.common.Constants;
import com.jdy.b2b.api.common.JSONUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.common.constants.annotations.Delete;
import com.jdy.b2b.api.common.constants.annotations.Query;
import com.jdy.b2b.api.common.constants.annotations.Save;
import com.jdy.b2b.api.common.constants.annotations.Update;
import com.jdy.b2b.api.model.product.BaseDO;
import com.jdy.b2b.api.model.product.Product;
import com.jdy.b2b.api.service.ProductsService;
import com.jdy.b2b.api.vo.product.ProductDetailVO;
import com.jdy.b2b.api.vo.product.ProductVO;
import com.jdy.b2b.api.vo.product.UpdateConfirmVO;
import com.jdy.b2b.api.vo.product.UpdateRecommendVO;

/**
 * @Description 产品控制层
 * @author 王斌
 * @date 2017年7月3日 下午5:44:11
 * @version V1.0
 */
@RestController
@RequestMapping("product")
public class ProductsController {

	@Autowired
	ProductsService productsImpl;

	// 产品列表
	@RequestMapping(value = "/list", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> queryList(
			@RequestBody @Validated(Query.class) ProductVO vo) {
		Product t = JSONUtil.trans(vo, Product.class);
		return ResultBean.getSuccessResult(productsImpl.queryList(t));
	}

	// 产品添加线路
	@RequestMapping(value = "/save", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> save(
			@RequestBody @Validated(Save.class) ProductVO vo) {
		Product product = JSONUtil.trans(vo, Product.class);
		product.setpConfirm(Byte.valueOf((byte) 1));
		initUpdateAndCreateUser(vo, product);
		return productsImpl.saveRoute(product, vo.getCover());
	}

	// 产品添加/修改
	@RequestMapping(value = "/update", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> update(
			@RequestBody @Validated(Update.class) ProductVO vo) {
		Product product = JSONUtil.trans(vo, Product.class);
		initUpdateUser(vo, product);
		return productsImpl.updateRoute(product, vo.getCover());
	}

	// 产品线路下架
	@RequestMapping(value = "/uneffect", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> uneffect(
			@RequestBody @Validated(Delete.class) ProductVO vo) {
		Product product = JSONUtil.trans(vo, Product.class);
		initUpdateUser(vo, product);
		return productsImpl.uneffectRoute(product);
	}

	// 产品线路上架
	@RequestMapping(value = "/effect", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> effect(
			@RequestBody @Validated(Delete.class) ProductVO vo) {
		Product product = JSONUtil.trans(vo, Product.class);
		initUpdateUser(vo, product);
		return productsImpl.effectRoute(product);
	}
	// 区域产品线路上架
	@RequestMapping(value = "/effectAreaProduct", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> effectAreaProduct(
			@RequestBody @Validated(Delete.class) ProductVO vo) {
		Product product = JSONUtil.trans(vo, Product.class);
		initUpdateUser(vo, product);
		ResultBean<Map<String, Object>> mapResultBean = productsImpl.effectRoute(product);
//		copyProduct(product.getId());

		return mapResultBean;
	}

	// 获取类型列表
	@RequestMapping(value = "/get_product_type", method = RequestMethod.POST)
	public ResultBean<LinkedHashMap<String, String>> findDataJson() {
		return ResultBean.getSuccessResult(Constants.ProduceType.POOL);
	}

	// 获取产品详情
	@RequestMapping(value = "/detail", method = RequestMethod.POST)
	public ResultBean<?> detail(@Valid @RequestBody ProductDetailVO vo) {
		return ResultBean.getSuccessResult(productsImpl.queryProductDetail(vo));
	}

	// 处理操作人
	private void initUpdateUser(BaseVO vo, BaseDO baseDO) {
		baseDO.setUpdateUser(vo.getPuserId());
	}

	// 处理操作人
	private void initUpdateAndCreateUser(BaseVO vo, BaseDO baseDO) {
		Long userId = vo.getPuserId();
		baseDO.setUpdateUser(userId);
		baseDO.setCreateUser(userId);
	}

	// // 获取品牌列表
	// @RequestMapping(value = "/getBrand", method = RequestMethod.POST)
	// public ResultBean<Map<String, Object>> queryBrandList(
	// @Valid QueryBrandListVO vo) {
	// CompanyBrand record = JSONUtil.trans(vo, CompanyBrand.class);
	// return ResultBean.getSuccessResult(productsImpl.getBrandList(record));
	// }

	// 修改确认状态
	@RequestMapping(value = "/updateConfirm", method = RequestMethod.POST)
	public ResultBean<?> updateConfirm(
			@Validated @RequestBody UpdateConfirmVO vo) {
		Product record = JSONUtil.trans(vo, Product.class);
		return ResultBean.getSuccessResult(productsImpl.updateConfirm(record));
	}

	// 修改推荐状态
	@RequestMapping(value = "/updateRecommend", method = RequestMethod.POST)
	public ResultBean<?> updateRecommend(
			@Validated @RequestBody UpdateRecommendVO vo) {
		Product record = JSONUtil.trans(vo, Product.class);
		return ResultBean
				.getSuccessResult(productsImpl.updateRecommend(record));
	}

	/**
	 * 手机端查询条件查询
	 * 
	 * @param code
	 * @param type
	 * @return
	 */
	@GetMapping("mobileListCondition/{code}/{type}")
	public ResultBean mobileListCondition(@PathVariable("code") String code,
			@PathVariable Integer type) {
		Map result = productsImpl.mobileListCondition(code, type);
		return ResultBean.getIndexSuccessResult(result);
	}

	// 产品删除
	@RequestMapping(value = "/delete/{pId}/{userId}", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> delete(@PathVariable("pId") Long pid,
			@PathVariable("userId") Long userId) {
		return productsImpl.delete(pid, userId);
	}

}
