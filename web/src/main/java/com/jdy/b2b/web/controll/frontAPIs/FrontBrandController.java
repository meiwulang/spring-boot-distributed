package com.jdy.b2b.web.controll.frontAPIs;

import java.util.Map;
import java.util.Objects;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jdy.b2b.web.annotation.NoLogin;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

/**
 * @Description 门户品牌接口
 * @author 王斌
 * @date 2017年9月19日 上午10:54:39
 * @version V1.0
 */
@NoLogin
@RestController
@Api(description = "门户品牌接口")
@SuppressWarnings("unchecked")
public class FrontBrandController extends BaseController {
	@ApiOperation(value = "首页品牌推荐/商家大全", hidden = true)
	@RequestMapping(value = "/b2b/business/boutiquelist", method = RequestMethod.GET)
	@ApiImplicitParams(value = {
			@ApiImplicitParam(name = "limit", paramType = "query", value = "查询数量"),
			@ApiImplicitParam(name = "city_code", value = "城市编号", paramType = "query", required = true) })
	public ResultBean<Map<String, Object>> boutiquelist(
			@RequestParam(name = "limit") Integer limit,
			@RequestParam(required = true, name = "city_code") String city_code) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("/b2b/business/boutiquelist?city_code=")
				.append(city_code);
		if (Objects.nonNull(limit)) {
			url.append("&limit=").append(limit);
		}
		return restTemplate
				.postForEntity(url.toString(), null, ResultBean.class)
				.getBody();
	}
}
