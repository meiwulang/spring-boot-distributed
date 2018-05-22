package com.jdy.b2b.api.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.jdy.b2b.api.common.JSONUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.station.Station;
import com.jdy.b2b.api.model.station.StationPrice;
import com.jdy.b2b.api.service.StationService;
import com.jdy.b2b.api.vo.station.StationPriceVO;
import com.jdy.b2b.api.vo.station.StationVO;

/**
 * @Description 出发站控制层
 * @author 王斌
 * @date 2017年7月13日 上午9:49:50
 * @version V1.0
 */
// @RestController
public class StationController {
	@Autowired
	private StationService service;

	/**
	 * @Description: 出发站列表
	 * @author 王斌
	 * @date 2017年7月13日 上午10:06:28
	 * @param vo
	 * @return
	 */
	@RequestMapping(value = "Station/fen_select", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> queryList(StationVO vo) {
		Station station = JSONUtil.trans(vo, Station.class);
		return service.queryList(station);
	}

	/**
	 * @Description: 出发站保存
	 * @author 王斌
	 * @date 2017年7月13日 上午10:06:54
	 * @param vo
	 * @return
	 */
	@RequestMapping(value = "Station/save", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> save(StationVO vo) {
		Station station = JSONUtil.trans(vo, Station.class);
		return service.save(station);
	}

	/**
	 * @Description: 出发站删除
	 * @author 王斌
	 * @date 2017年7月13日 上午10:07:36
	 * @param vo
	 * @return
	 */
	@RequestMapping(value = "Station/del", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> del(StationVO vo) {
		Station station = JSONUtil.trans(vo, Station.class);
		return service.del(station);
	}

	/**
	 * @Description: 班车列表
	 * @author 王斌
	 * @date 2017年7月13日 上午10:07:51
	 * @param vo
	 * @return
	 */
	@RequestMapping(value = "StationPrice/dataJson", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> stationPriceDataJson(
			StationPriceVO vo) {
		StationPrice sp = JSONUtil.trans(vo, StationPrice.class);
		return service.stationPriceDataJson(sp);
	}

	/**
	 * @Description: 班车保存
	 * @author 王斌
	 * @date 2017年7月13日 上午10:08:10
	 * @param vo
	 * @return
	 */
	@RequestMapping(value = "StationPrice/save", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> stationPriceSave(StationPriceVO vo) {
		StationPrice sp = JSONUtil.trans(vo, StationPrice.class);
		return service.stationPriceSave(sp);
	}

	/**
	 * @Description: 班车删除
	 * @author 王斌
	 * @date 2017年7月13日 上午10:09:03
	 * @param vo
	 * @return
	 */
	@RequestMapping(value = "StationPrice/del", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> stationPriceDel(StationPriceVO vo) {
		StationPrice sp = JSONUtil.trans(vo, StationPrice.class);
		return service.stationPriceDel(sp);
	}
}
