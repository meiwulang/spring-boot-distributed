package com.jdy.b2b.web.controll.product;

import java.util.Map;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.jdy.b2b.web.pojo.log.MyLog;
import com.jdy.b2b.web.pojo.product.TripsVO;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;
import com.jdy.b2b.web.util.annotations.Delete;
import com.jdy.b2b.web.util.annotations.Query;
import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

/**
 * @Description 产品控制层
 * @author 王斌
 * @date 2017年7月3日 下午5:44:11
 * @version V1.0
 */
@RestController
@RequestMapping("trip")
@SuppressWarnings("unchecked")
@Api(description = "行程接口")
public class TripController extends BaseController {

	// 产品行程列表
	@RequestMapping(value = "/list", method = RequestMethod.POST)
	@ApiOperation(value = "产品行程列表")
	public ResultBean<Map<String, Object>> queryList(
			@Validated(Query.class) @RequestBody TripsVO vo) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("trip/list");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class)
				.getBody();
	}

	// 产品添加行程
	@MyLog
	@RequestMapping(value = "/save", method = RequestMethod.POST)
	@ApiOperation(value = "产品添加行程")
	public ResultBean<Map<String, Object>> save(
			@Validated(Save.class) @RequestBody TripsVO vo) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("trip/save");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class)
				.getBody();
	}

	// 产品修改行程
	@RequestMapping(value = "/update", method = RequestMethod.POST)
	@ApiOperation(value = "产品修改行程")
	@MyLog
	public ResultBean<Map<String, Object>> update(
			@RequestBody @Validated(Update.class) TripsVO vo) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("trip/update");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class)
				.getBody();
	}

	// 产品批量删除行程
	@RequestMapping(value = "/batchDelete", method = RequestMethod.POST)
	@ApiOperation(value = "产品批量删除行程")
	@MyLog
	public ResultBean<Map<String, Object>> batchDelete(
			@RequestBody @Validated(Delete.class) TripsVO vo) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("trip/batchDelete");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class)
				.getBody();
	}
}
