package com.jdy.b2b.api.controller;

import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.service.FrontProductsService;
import com.jdy.b2b.api.vo.product.FrontProductVO;
import com.jdy.b2b.api.vo.product.FrontStationVO;

/**
 * @Description 门户产品接口
 * @author 王斌
 * @date 2017年9月19日 上午10:54:39
 * @version V1.0
 */
@RestController
public class FrontProductController {
	@Autowired
	private FrontProductsService frontProductsService;

	@RequestMapping(value = "/b2b/adver/buslist", method = RequestMethod.GET)
	public ResultBean<?> buslist(@RequestParam(name = "type") String type,
			@RequestParam(name = "start") int start,
			@RequestParam(required = true, name = "city_code") String city_code) {
		return null;
	}

	@RequestMapping(value = "/b2b/product/detail", method = RequestMethod.GET)
	public ResultBean<?> detail(
			@RequestParam(name = "p_id", required = true) Long p_id,
			@RequestParam(name = "start_date", required = false) String start_date,
			@RequestParam(name = "from", required = false) String from,
			@RequestParam(name = "openId", required = false) String openId,
			@RequestParam(name = "companyId", required = false) Long companyId,
			@RequestParam(name = "city_code", required = false) String city_code) {
		return frontProductsService.detail(p_id, start_date, city_code, from,
				openId, companyId);
	}

	@RequestMapping(value = "/B2b/Product/lists", method = RequestMethod.GET)
	public ResultBean<?> lists(
			@RequestParam(name = "start", required = true) Integer start,
			@RequestParam(name = "city_code", required = true) String city_code,
			@RequestParam(name = "limit") Integer limit,
			@RequestParam(required = true, name = "type") String type) {
		return null;
	}

	@RequestMapping(value = "/b2b/shop/info", method = RequestMethod.GET)
	public ResultBean<?> info(
			@RequestParam(name = "p_id", required = true) Integer p_id,
			@RequestParam(name = "bl_id", required = true) Integer bl_id,
			@RequestParam(name = "sign", required = true) String sign,
			@RequestParam(name = "time_stamp") String time_stamp,
			@RequestParam(required = true, name = "city_code") String city_code) {
		return null;
	}

	@RequestMapping(value = "/b2b/adver/wap_buslist", method = RequestMethod.GET)
	public ResultBean<?> wap_buslist(
			@RequestParam(name = "source", required = true) String source,
			@RequestParam(name = "openid", required = true) String openid,
			@RequestParam(required = true, name = "city_code") String city_code,
			@RequestParam(required = true, name = "dataLimit") Integer dataLimit,
			@RequestParam(required = true, name = "companyId") Long companyId) {
		return frontProductsService.wap_buslist(source, null, openid, dataLimit,
				companyId);
	}

	@RequestMapping(value = "/B2b/Product/lists", method = RequestMethod.POST)
	ResultBean<?> appPdtlists(@RequestBody FrontProductVO vo) {
		if (Objects.isNull(vo.getLimit()) || vo.getLimit() < 0) {
			vo.setLimit(999);
		}
		if (Objects.isNull(vo.getStart()) || vo.getStart() < 0) {
			vo.setStart(0);
		}
		return frontProductsService.appPdtlists(vo);
	}

	@RequestMapping(value = "/h5/shop/shop/station", method = RequestMethod.POST)
	public ResultBean<?> station(@RequestBody FrontStationVO vo) {
		if (Objects.isNull(vo.getLimit()) || vo.getLimit() < 0) {
			vo.setLimit(999);
		}
		if (Objects.isNull(vo.getStart()) || vo.getStart() < 0) {
			vo.setStart(0);
		}
		return frontProductsService.station(vo);
	}

	@RequestMapping(value = "front/h5/adver/getCalendarMonths", method = RequestMethod.GET)
	public ResultBean<?> getCalendarMonths(
			@RequestParam(name = "p_id", required = true) Long p_id,
			@RequestParam("source") String source,
			@RequestParam(required = true, name = "city_code") String city_code) {
		return frontProductsService.getCalendarMonths(p_id, null);
	}
}
