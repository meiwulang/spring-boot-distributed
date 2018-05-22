package com.jdy.b2b.api.controller;

import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.jdy.b2b.api.common.Constants;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.common.constants.annotations.Delete;
import com.jdy.b2b.api.common.constants.annotations.Query;
import com.jdy.b2b.api.common.constants.annotations.Update;
import com.jdy.b2b.api.model.product.Keys;
import com.jdy.b2b.api.service.ProductKeysService;
import com.jdy.b2b.api.vo.product.SaveProductKeyRelationVO;

/**
 * Created by dugq on 2017/7/20.
 */
@Controller
@RequestMapping("productKey")
@SuppressWarnings("rawtypes")
public class ProductKeyController {
	@Autowired
	private ProductKeysService productKeysService;

	@RequestMapping("getKey")
	@ResponseBody
	public ResultBean getKey(@RequestBody @Validated(Query.class) Keys keys) {
		// if (Objects.isNull(id)) {
		// return new ResultBean<>(Error.COMMON_ERROR_CODE, Error.ERROR_ID);
		// }
		// if (Objects.isNull(companyId)) {
		// return new ResultBean<>(Error.COMMON_ERROR_CODE,
		// Error.ERROR_COMPANYID);
		// }
		return ResultBean.getSuccessResult(
				productKeysService.getKey(keys.getId(), keys.getCompanyId()));
	}

	@RequestMapping("updateKey")
	@ResponseBody
	public ResultBean updateKey(
			@RequestBody @Validated(Update.class) Keys keys) {
		return (productKeysService.updateKey(keys));
	}

	@RequestMapping("deleteKey")
	@ResponseBody
	public ResultBean deleteKey(
			@RequestBody @Validated(Delete.class) Keys keys) {
		productKeysService.deleteByPrimaryKeyAndCompanyId(keys.getId(),
				keys.getCompanyId());
		return ResultBean.getSuccessResult();
	}

	@RequestMapping("deleteProductKeyRelation")
	@ResponseBody
	public ResultBean deleteProductKeyRelation(Long productId, Long keyId) {
		productKeysService.deleteProductKeyRelation(productId, keyId);
		return ResultBean.getSuccessResult();
	}

	@RequestMapping("{productId}/saveNewKey")
	@ResponseBody
	public ResultBean saveNewKey(@RequestBody Keys keys,
			@PathVariable Long productId) {
		productKeysService.insertSelective(keys, productId);
		ResultBean successResult = ResultBean.getSuccessResult();
		successResult.setId(keys.getId());
		return successResult;
	}

	@RequestMapping("/saveNewKey")
	@ResponseBody
	public ResultBean saveNewKey(@RequestBody Keys keys) {
		productKeysService.insertSelective(keys, null);
		ResultBean successResult = ResultBean.getSuccessResult();
		successResult.setId(keys.getId());
		return successResult;
	}

	@RequestMapping("saveProductKeyRelation")
	@ResponseBody
	public ResultBean saveProductKeyRelation(Long productId, Long keyId) {
		productKeysService.insertProductKeyRelation(productId, keyId);
		return ResultBean.getSuccessResult();
	}

	@ResponseBody
	@RequestMapping("batchSaveProductKeyRelation")
	public ResultBean batchSaveProductKeyRelation(
			@Validated @RequestBody SaveProductKeyRelationVO vo) {
		return productKeysService.insertProductKeyRelation(vo);
	}

	@RequestMapping("selectKeyListByProductId")
	@ResponseBody
	public ResultBean selectKeyListByProductId(Long productId) {
		List<Keys> keys = productKeysService.selectKeysByProductId(productId);
		return ResultBean.getSuccessResult(keys);
	}

	@RequestMapping("selectKeyListByCompanyId")
	@ResponseBody
	public ResultBean<Map<String, Object>> selectKeyListByCompanyId(
			@RequestBody Keys key) {
		if (Objects.isNull(key.getCompanyId())) {
			return new ResultBean<>(Constants.Error.COMMON_ERROR_CODE,
					Constants.Error.ERROR_COMPANYID);
		}
		return productKeysService.selectKeysByCompanyId(key);
	}
}
