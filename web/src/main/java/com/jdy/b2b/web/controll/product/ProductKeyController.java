package com.jdy.b2b.web.controll.product;

import org.springframework.stereotype.Controller;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.jdy.b2b.web.pojo.log.MyLog;
import com.jdy.b2b.web.pojo.product.KeysVO;
import com.jdy.b2b.web.pojo.product.SaveProductKeyRelationVO;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;
import com.jdy.b2b.web.util.annotations.Delete;
import com.jdy.b2b.web.util.annotations.Query;
import com.jdy.b2b.web.util.annotations.Update;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * Created by dugq on 2017/7/20.
 */
@Controller
@RequestMapping(value = "productKey")
@Api(description = "关键词接口")
@SuppressWarnings("rawtypes")
public class ProductKeyController extends BaseController {
	@MyLog
	@RequestMapping(value = "deleteKey", method = RequestMethod.POST)
	@ResponseBody
	@ApiOperation(value = "删除关键词")
	public ResultBean deleteKey(
			@RequestBody @Validated(Delete.class) KeysVO key) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("productKey/deleteKey");
		return restTemplate.postForObject(url.toString(), key,
				ResultBean.class);
	}

	@MyLog
	@ApiImplicitParams(value = {
			@ApiImplicitParam(name = "keyId", paramType = "query", value = "关键词id", required = true),
			@ApiImplicitParam(name = "productId", paramType = "query", value = "产品编号", required = true) })
	@RequestMapping(value = "deleteProductKeyRelation", method = RequestMethod.POST)
	@ResponseBody
	@ApiOperation(value = "删除产品关键词关联关系")
	public ResultBean deleteProductKeyRelation(Long productId, Long keyId) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("productKey/deleteProductKeyRelation");
		LinkedMultiValueMap<String, Long> map = new LinkedMultiValueMap<>(2);
		map.add("productId", productId);
		map.add("keyId", keyId);
		return restTemplate.postForEntity(url.toString(), map, ResultBean.class)
				.getBody();
	}

	@MyLog
	@RequestMapping(value = "{productId}/saveNewKey", method = RequestMethod.POST)
	@ResponseBody
	@ApiOperation(value = "保存关键词并关联产品")
	public ResultBean saveNewKey(@RequestBody KeysVO keys,
			@PathVariable @ApiParam(value = "产品编号", required = true, name = "productId") Long productId) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("productKey/").append(productId).append("/saveNewKey");
		Long userId = keys.getPuserId();
		keys.setUpdateUser(userId);
		keys.setCreateUser(userId);

		return restTemplate
				.postForEntity(url.toString(), keys, ResultBean.class)
				.getBody();
	}

	@MyLog
	@RequestMapping(value = "/saveNewKey", method = RequestMethod.POST)
	@ResponseBody
	@ApiOperation(value = "保存关键词")
	public ResultBean saveNewKey(@RequestBody KeysVO keys) {
		Long userId = keys.getPuserId();
		keys.setUpdateUser(userId);
		keys.setCreateUser(userId);
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("productKey/saveNewKey");
		return restTemplate
				.postForEntity(url.toString(), keys, ResultBean.class)
				.getBody();
	}

	@MyLog
	@ApiImplicitParams(value = {
			@ApiImplicitParam(name = "productId", paramType = "query", value = "产品id", required = true),
			@ApiImplicitParam(name = "keyId", paramType = "query", value = "关键词id", required = true) })
	@RequestMapping(value = "saveProductKeyRelation", method = RequestMethod.POST, produces = "application/x-www-form-urlencoded")
	@ResponseBody
	@ApiOperation(value = "保存产品关键词关联关系")
	public ResultBean saveProductKeyRelation(Long productId, Long keyId) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("productKey/saveProductKeyRelation");
		LinkedMultiValueMap<String, Long> map = new LinkedMultiValueMap<>();
		map.add("productId", productId);
		map.add("keyId", keyId);
		return restTemplate.postForObject(url.toString(), map,
				ResultBean.class);
	}

	@MyLog
	@ResponseBody
	@RequestMapping(value = "batchSaveProductKeyRelation", method = RequestMethod.POST)
	@ApiOperation(value = "批量保存产品关键词关联关系")
	public ResultBean batchSaveProductKeyRelation(
			@Validated @RequestBody SaveProductKeyRelationVO vo) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("productKey/batchSaveProductKeyRelation");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class)
				.getBody();
	}

	@ApiImplicitParams(value = {
			@ApiImplicitParam(name = "productId", paramType = "query", value = "产品id", required = true) })
	@RequestMapping(value = "selectKeyListByProductId", method = RequestMethod.POST)
	@ResponseBody
	@ApiOperation(value = "查询产品关键词列表")
	public ResultBean selectKeyListByProductId(Long productId) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("productKey/selectKeyListByProductId");
		LinkedMultiValueMap<String, Long> map = new LinkedMultiValueMap<>();
		map.add("productId", productId);
		return restTemplate.postForObject(url.toString(), map,
				ResultBean.class);
	}

	@RequestMapping(value = "selectKeyListByCompanyId", method = RequestMethod.POST)
	@ResponseBody
	@ApiOperation(value = "查询企业关键词")
	public ResultBean selectKeyListByCompanyId(@RequestBody KeysVO key) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("productKey/selectKeyListByCompanyId");
		return restTemplate.postForEntity(url.toString(), key, ResultBean.class)
				.getBody();
	}

	@RequestMapping(value = "getKey", method = RequestMethod.POST)
	@ResponseBody
	@ApiOperation(value = "查询关键词详情")
	public ResultBean getKey(@RequestBody @Validated(Query.class) KeysVO keys) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("productKey/getKey");
		return restTemplate.postForObject(url.toString(), keys,
				ResultBean.class);
	}

	@ResponseBody
	@MyLog
	@RequestMapping(value = "updateKey", method = RequestMethod.POST)
	@ApiOperation(value = "修改关键词详情")
	public ResultBean updateKey(
			@RequestBody @Validated(Update.class) KeysVO keys) {
		keys.setUpdateUser(keys.getPuserId());
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("productKey/updateKey");
		return restTemplate
				.postForEntity(url.toString(), keys, ResultBean.class)
				.getBody();
	}
}
