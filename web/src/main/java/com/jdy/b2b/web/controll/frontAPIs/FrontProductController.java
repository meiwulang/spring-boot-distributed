package com.jdy.b2b.web.controll.frontAPIs;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.constraints.NotNull;

import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.jdy.b2b.web.annotation.NoLogin;
import com.jdy.b2b.web.pojo.city.CitySelectVO;
import com.jdy.b2b.web.pojo.city.CityVo;
import com.jdy.b2b.web.pojo.departure.FrontStationVO;
import com.jdy.b2b.web.pojo.product.FrontProductVO;
import com.jdy.b2b.web.pojo.user.UserResultDTO;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.Constants;
import com.jdy.b2b.web.util.IpAddressUtil;
import com.jdy.b2b.web.util.JSONUtil;
import com.jdy.b2b.web.util.ResultBean;
import com.jdy.b2b.web.util.ip.IPLocate.IPLocationAction;
import com.jdy.b2b.web.util.ip.IPLocate.IPResult;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * @Description 门户产品接口
 * @author 王斌
 * @date 2017年9月19日 上午10:54:39
 * @version V1.0
 */
@NoLogin
@RestController
@Api(description = "门户产品接口")
@SuppressWarnings({ "unchecked", "rawtypes" })
public class FrontProductController extends BaseController {
	Logger logger = LoggerFactory.getLogger(this.getClass());
	@Value("${systemCenterUrl}City")
	String SYSTEM_CENTER_MODULE_URL;

	@Value("${spring.qqwry.path}")
	String ip_path;

	@ApiOperation("查询城市列表,带搜索")
	@GetMapping("designCityList/{cityStr}")
	public ResultBean<?> designCityList(@PathVariable String cityStr) {
		CitySelectVO selectVO = new CitySelectVO();
		selectVO.setSearchStr(cityStr);
		String url = SYSTEM_CENTER_MODULE_URL + "/selectCityPutList";
		ResultBean<?> cityBean = restTemplate.postForObject(url, selectVO,
				ResultBean.class);
		if (cityBean.isFail()) {
			return new ResultBean<>(cityBean.getCode(), cityBean.getMessage());
		} else {
			List cityList = new ArrayList<>();
			List unParseList = cityBean.getParsedEnitity(List.class);
			String jsonStr = JSON.toJSONString(unParseList);
			List<CityVo> cities = JSONUtil
					.trans2List(JSON.toJSONString(unParseList), CityVo.class);
			cities.forEach(s -> {
				Map m = new HashMap<>();
				m.put("gname", "");
				m.put("data", s.getName());
				cityList.add(m);
			});
			return ResultBean.getSuccessResult(cityList);
		}
	}

	@ApiOperation("获取当前城市和所有其他省市列表")
	@GetMapping("front/Order/h5/currCity")
	public ResultBean<?> currCity(HttpServletRequest request) {
		logger.info("############获取当前城市和所有其他省市列表###############3");
		ResultBean bean = new ResultBean<>();
		Map data = new HashMap<>();

		String url = SYSTEM_CENTER_MODULE_URL + "/selectCityPutList";
		ResultBean<?> cityBean = restTemplate.postForObject(url,
				new CitySelectVO(), ResultBean.class);
		if (cityBean.isFail()) {
			bean.setCode(cityBean.getCode());
			bean.setMessage(cityBean.getMessage());
		} else {
			List cityList = new ArrayList<>();
			Map<?, ?> cities = (Map<?, ?>) cityBean.getBody();
			cities.forEach((k, v) -> {
				Map m = new HashMap<>();
				m.put("gname", k);
				m.put("data", v);
				cityList.add(m);
			});
			data.put("cityList", cityList);
		}
		String ip = IpAddressUtil.getIpAdrress(request);
		IPResult ipResult = null;
		Map c = new HashMap();
		if (StringUtils.isNotEmpty(ip)) {
			ipResult = IPLocationAction.getIPLocation(ip, ip_path);
		}

		if (null == ipResult || StringUtils.isEmpty(ipResult.getCity())) {
			bean.setCode("0");
			bean.setMessage("该IP无法解析");
			logger.error("该IP库无法解析:" + ip);
		} else {
			c.put("name", ipResult.getCity().replace("市", ""));
			c.put("code",
					ipResult.getCityCode() + String.format(
							"%0" + (6 - ipResult.getCityCode().length()) + "d",
							0));
			data.put("currentCity", c);

		}

		if (null == data.get("currentCity")) {
			JSONObject res = IpAddressUtil.getCityInfoByIP(ip);
			if ((Integer) res.get("code") == 0) {
				Map r = (Map) res.get("data");
				c.put("name", r.get("city").toString().replace("市", ""));
				c.put("code", r.get("city_id"));
				data.put("currentCity", c);
			}
		}

		if (null == data.get("currentCity")) {
			c.put("name", "西安");
			c.put("code", "610100");
			data.put("currentCity", c);
		}
		logger.info("name:" + c.get("name"));
		logger.info("code:" + c.get("code"));
		bean.setData(data);
		bean.setCode("200");
		bean.setMessage("ok");

		return bean;
	}

	@ApiOperation(value = "首页产品分组列表/产品列表", hidden = true)
	@RequestMapping(value = "/b2b/adver/buslist", method = RequestMethod.GET)
	@ApiImplicitParams(value = {
			@ApiImplicitParam(name = "type", paramType = "query", value = "产品类型"),
			@ApiImplicitParam(name = "start", paramType = "query", value = "页码"),
			@ApiImplicitParam(name = "city_code", value = "城市编号", paramType = "query", required = true) })
	public ResultBean<Map<String, Object>> boutiquelist(
			@RequestParam(name = "type") String type,
			@RequestParam(name = "start") int start,
			@RequestParam(required = true, name = "city_code") String city_code) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("/b2b/adver/buslist?city_code=").append(city_code)
				.append("&start=").append(start);
		if (Objects.nonNull(type)) {
			url.append("&type=").append(type);
		}
		return restTemplate.getForEntity(url.toString(), ResultBean.class)
				.getBody();
	}

	@ApiOperation(value = "产品详情")
	@RequestMapping(value = "front/b2b/product/detail", method = RequestMethod.GET)
	@ApiImplicitParams(value = {
			@ApiImplicitParam(name = "p_id", paramType = "query", value = "产品编号"),
			@ApiImplicitParam(name = "from", paramType = "query", value = "来源请求"),
			@ApiImplicitParam(name = "start_date", paramType = "query", value = "页码"),
			@ApiImplicitParam(name = "city_code", value = "城市编号", paramType = "query") })
	public ResultBean<Map<String, Object>> detail(
			@RequestParam(name = "p_id", required = true) Integer p_id,
			@RequestParam(name = "openid", required = false) String openid,
			@RequestParam(name = "start_date", required = false) String start_date,
			@RequestParam(name = "from", required = false) String from,
			@RequestParam(name = "city_code", required = false) String city_code) {
		Long companyId = null;
		Subject subject = SecurityUtils.getSubject();
		UserResultDTO userInfo = (UserResultDTO) subject.getPrincipal();
		if (StringUtils.isBlank(openid) && !"preview".equals(from)) {

			if (userInfo == null) {
				return new ResultBean<>("-5", "请先登录~");
			} else {
				openid = userInfo.getuWxOpenId();
			}
		}
		if(null!=userInfo)
			companyId = userInfo.getuCompanyId();
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("/b2b/product/detail?city_code=").append(city_code)
				.append("&start_date=").append(start_date);
		url.append("&p_id=").append(p_id).append("&openId=").append(openid)
				.append("&from=").append(from).append("&companyId=");
		if (companyId != null) {
			url.append(companyId);
		}
		ResultBean bean = restTemplate
				.getForEntity(url.toString(), ResultBean.class).getBody();
		bean.setCode("200");
		bean.setMessage("ok");
		bean.setData(bean.getBody());
		bean.setBody(null);
		return bean;
	}

	@ApiOperation(value = "首页产品分组列表/产品列表", hidden = true)
	@RequestMapping(value = "/b2b/shop/info", method = RequestMethod.GET)
	@ApiImplicitParams(value = {
			@ApiImplicitParam(name = "p_id", paramType = "query", value = "产品编号"),
			@ApiImplicitParam(name = "bl_id", paramType = "query", value = "班期编号"),
			@ApiImplicitParam(name = "time_stamp", paramType = "query", value = "时间戳"),
			@ApiImplicitParam(name = "sign", paramType = "query", value = "签名"),
			@ApiImplicitParam(name = "city_code", value = "城市编号", paramType = "query", required = true) })
	public ResultBean<Map<String, Object>> info(
			@RequestParam(name = "p_id", required = true) Integer p_id,
			@RequestParam(name = "bl_id", required = true) Integer bl_id,
			@RequestParam(name = "sign", required = true) String sign,
			@RequestParam(name = "time_stamp") String time_stamp,
			@RequestParam(required = true, name = "city_code") String city_code) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("/b2b/shop/info?city_code=").append(city_code)
				.append("&p_id=").append(p_id).append("&bl_id=").append(bl_id)
				.append("&sign=").append(sign).append("&time_stamp=")
				.append(time_stamp);
		return restTemplate.getForEntity(url.toString(), ResultBean.class)
				.getBody();
	}

	@ApiOperation(value = "【手机端】首页列表接口")
	@RequestMapping(value = "front/b2b/adver/wap_buslist", method = RequestMethod.GET)
	@ApiImplicitParams(value = {
			@ApiImplicitParam(name = "source", paramType = "query", value = "来源"),
			@ApiImplicitParam(name = "openid", paramType = "query", value = "用户账号"),
			@ApiImplicitParam(name = "city_code", value = "城市编号", paramType = "query", required = true) })
	public ResultBean<?> wap_buslist(
			@RequestParam(name = "source", required = true) String source,
			@RequestParam(name = "openid", required = true) String openid,
			@RequestParam(required = true, name = "city_code") String city_code) {
		Subject subject = SecurityUtils.getSubject();
		UserResultDTO userInfo = (UserResultDTO) subject.getPrincipal();

		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("/b2b/adver/wap_buslist?city_code=").append(city_code)
				.append("&source=").append(source).append("&openid=")
				.append(openid).append("&dataLimit=")
				.append(userInfo.getuDataLimit()).append("&companyId=")
				.append(userInfo.getuCompanyId());
		ResultBean bean = restTemplate
				.getForEntity(url.toString(), ResultBean.class).getBody();
		bean.setCode("200");
		bean.setMessage("ok");
		bean.setData(bean.getBody());
		bean.setBody(null);
		return bean;
	}

	@ApiOperation(value = "【手机端】产品列表页接品")
	@RequestMapping(value = "front/B2b/Product/lists", method = RequestMethod.POST)
	public ResultBean<?> appPdtlists(@RequestBody FrontProductVO vo) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("/B2b/Product/lists");
		ResultBean bean = restTemplate
				.postForEntity(url.toString(), vo, ResultBean.class).getBody();
		bean.setCode("200");
		bean.setMessage("ok");
		bean.setData(bean.getBody());
		bean.setBody(null);
		return bean;
	}

	@ApiOperation(value = "【手机端】获取接送站点信息")
	@RequestMapping(value = "front/b2b/shop/station", method = RequestMethod.POST)
	public ResultBean<?> station(@RequestBody FrontStationVO vo) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("/h5/shop/shop/station");
		ResultBean bean = restTemplate
				.postForEntity(url.toString(), vo, ResultBean.class).getBody();
		bean.setCode("200");
		bean.setMessage("ok");
		bean.setData(bean.getBody());
		bean.setBody(null);
		return bean;
	}

	/**
	 * 【手机端】列表页筛选条件接口
	 *
	 */
	@SuppressWarnings("rawtypes")
	@ApiOperation(value = "【手机端】列表页筛选条件接口")
	@GetMapping("front/B2b/Product/listcondition")
	public ResultBean mobileListCondition(
			@RequestParam("city_code") @NotNull @ApiParam(value = "城市码", required = true, name = "city_code") String city_code,
			@RequestParam("source") @ApiParam(value = "终端类型", required = true, name = "source") String source,
			@RequestParam("type") @NotNull @ApiParam(value = "线路类型", required = true, name = "type") Integer type) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("product/mobileListCondition/").append(city_code)
				.append("/").append(type);
		return restTemplate.getForEntity(url.toString(), ResultBean.class)
				.getBody();

	}

	@ApiOperation(value = "【手机端】startcity列表")
	@GetMapping("front/h5/Adver/getStartCity")
	public void getStartCity(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		response.setCharacterEncoding("utf-8");
		response.setHeader("Content-Type", "application/json; charset=utf-8");
		response.getWriter().print(JSON.toJSONString(
				JSON.parseObject(Constants.CITY_INFO, HashMap.class)));
	}

	@ApiOperation(value = "【手机端】getCalendarMonths列表")
	@GetMapping("front/h5/adver/getCalendarMonths")
	public ResultBean<?> getCalendarMonths(
			@RequestParam(name = "p_id", required = true) Long p_id,
			@RequestParam("source") String source,
			@RequestParam(required = true, name = "city_code") String city_code)
			throws IOException {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("front/h5/adver/getCalendarMonths?p_id=").append(p_id)
				.append("&source=").append(source).append("&city_code=")
				.append(city_code);

		ResultBean bean = restTemplate
				.getForEntity(url.toString(), ResultBean.class).getBody();
		bean.setCode("200");
		bean.setMessage("ok");
		return bean;
	}
}
