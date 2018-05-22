package com.jdy.b2b.web.controll.product;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;

import javax.validation.Valid;

import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.cache.Cache;
import org.apache.shiro.cache.ehcache.EhCacheManager;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.jdy.b2b.web.pojo.log.MyLog;
import com.jdy.b2b.web.pojo.product.ProductDetailVO;
import com.jdy.b2b.web.pojo.product.ProductVO;
import com.jdy.b2b.web.pojo.product.UpdateConfirmVO;
import com.jdy.b2b.web.pojo.product.UpdateRecommendVO;
import com.jdy.b2b.web.pojo.user.UserResultDTO;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;
import com.jdy.b2b.web.util.annotations.Delete;
import com.jdy.b2b.web.util.annotations.Query;
import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("product")
@SuppressWarnings("unchecked")
@Api(description = "产品接口")
public class ProductController extends BaseController {

	@Autowired
	@Qualifier("shiroEhcacheManager")
	private EhCacheManager ehCacheManager;

	// 产品列表
	@ApiOperation(value = "列表")
	@RequestMapping(value = "/list", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> queryList(
			@RequestBody @Validated(Query.class) ProductVO vo) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("product/list");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class)
				.getBody();
	}

	// 产品添加线路
	@RequestMapping(value = "/save", method = RequestMethod.POST)
	@ApiOperation(value = "产品添加线路")
	@MyLog
	public ResultBean<Map<String, Object>> save(
			@RequestBody @Validated(Save.class) ProductVO vo) {
		Long contacts = vo.getpContacts();
		if (Objects.isNull(contacts) || contacts.equals(Long.valueOf(0L))) {
			vo.setpContacts(vo.getPuserId());
		}
		if (vo.getpFrom().equals(Integer.valueOf(1))) {
			if (StringUtils.isBlank(vo.getpFromName())) {
				return new ResultBean<>("-1", "非自营来源名称在非自营情况下必填。");
			}
		} else {
			vo.setpFromName("");
		}
		vo.setCompanyId(vo.getPcompanyId());
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("product/save");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class)
				.getBody();
	}

	// 产品修改
	@RequestMapping(value = "/update", method = RequestMethod.POST)
	@ApiOperation(value = "产品修改")
	@MyLog
	public ResultBean<Map<String, Object>> update(
			@RequestBody @Validated(Update.class) ProductVO vo) {
		Long contacts = vo.getpContacts();
		if (Objects.isNull(contacts) || contacts.equals(Long.valueOf(0L))) {
			vo.setpContacts(vo.getPuserId());
		}
		if (vo.getpFrom().equals(Integer.valueOf(1))) {
			if (StringUtils.isBlank(vo.getpFromName())) {
				return new ResultBean<>("-1", "非自营来源名称在非自营情况下必填。");
			}
		} else {
			vo.setpFromName("");
		}
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("product/update");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class)
				.getBody();
	}

	// 产品线路下架
	@RequestMapping(value = "/uneffect", method = RequestMethod.POST)
	@ApiOperation(value = "产品线路下架")
	@MyLog
	public ResultBean<Map<String, Object>> uneffect(
			@RequestBody @Validated(Delete.class) ProductVO vo) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("product/uneffect");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class)
				.getBody();
	}

	// 产品线路上架
	@RequestMapping(value = "/effect", method = RequestMethod.POST)
	@ApiOperation(value = "产品线路上架")
	@MyLog
	public ResultBean<Map<String, Object>> effect(
			@RequestBody @Validated(Delete.class) ProductVO vo) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("product/effect");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class)
				.getBody();
	}

	// 获取类型列表
	@RequestMapping(value = "/get_product_type", method = RequestMethod.POST)
	@ApiOperation(value = "获取类型列表")
	public ResultBean<LinkedHashMap<String, String>> findDataJson() {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("product/get_product_type");
		return restTemplate
				.postForEntity(url.toString(), null, ResultBean.class)
				.getBody();
	}

	// 获取产品详情
	@RequestMapping(value = "/detail", method = RequestMethod.POST)
	@ApiOperation(value = "获取产品详情")
	public ResultBean<?> detail(@Valid @RequestBody ProductDetailVO vo) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("product/detail");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class)
				.getBody();
	}

	// 获取产品详情
	@RequestMapping(value = "/updateConfirm", method = RequestMethod.POST)
	@ApiOperation(value = "修改产品确认状态")
	public ResultBean<?> updateConfirm(@Valid @RequestBody UpdateConfirmVO vo) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("product/updateConfirm");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class)
				.getBody();
	}

	// 获取产品详情
	@RequestMapping(value = "/updateRecommend", method = RequestMethod.POST)
	@ApiOperation(value = "修改产品推荐状态")
	public ResultBean<?> updateRecommend(
			@Valid @RequestBody UpdateRecommendVO vo) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("product/updateRecommend");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class)
				.getBody();
	}

	// 产品列表
	@ApiOperation(value = "删除")
	@RequestMapping(value = "/delete/{pid}", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> delete(
			@PathVariable("pid") Long pid) {
		Subject subject = SecurityUtils.getSubject();
		UserResultDTO user = (UserResultDTO) subject.getPrincipal();
		Long userId = user == null ? null : user.getUserId();
		if (userId == null) {
			return new ResultBean<>("-1", "用户信息丢失，请重新登录");
		}
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("product/delete/").append(pid).append("/")
				.append(userId);
		return restTemplate
				.postForEntity(url.toString(), null, ResultBean.class)
				.getBody();
	}
}
