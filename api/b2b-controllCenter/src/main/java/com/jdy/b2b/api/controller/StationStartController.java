package com.jdy.b2b.api.controller;

import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.jdy.b2b.api.common.JSONUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.station.StationStart;
import com.jdy.b2b.api.service.StationStartService;
import com.jdy.b2b.api.vo.station.DelStationStartVO;
import com.jdy.b2b.api.vo.station.QueryStationStartListVO;
import com.jdy.b2b.api.vo.station.SaveOrUpdateStationStartVO;

/**
 * @Description TODO
 * @author 王斌
 * @date 2017年7月10日 上午9:41:36
 * @version V1.0
 */
// @RestController
@RequestMapping(value = "StationStart", method = RequestMethod.POST)
public class StationStartController {
	@Autowired
	private StationStartService service;

	// 始发站列表
	@RequestMapping(value = "/fen_select", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> queryList(
			QueryStationStartListVO vo) {
		StationStart t = JSONUtil.trans(vo, StationStart.class);
		return ResultBean.getSuccessResult(service.queryList(t));
	}

	// 始发站列表for新增票
	@RequestMapping(value = "/start_site_group", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> queryListForTicket(
			QueryStationStartListVO vo) {
		StationStart t = JSONUtil.trans(vo, StationStart.class);
		return ResultBean.getSuccessResult(service.queryListForTicket(t));
	}

	// 始发站添加/修改
	@RequestMapping(value = "/save", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> saveOrUpdate(
			@Valid SaveOrUpdateStationStartVO vo) {
		StationStart t = JSONUtil.trans(vo, StationStart.class);
		return service.saveOrUpdate(t);
	}

	// 始发站删除
	@RequestMapping(value = "/del", method = RequestMethod.POST)
	public ResultBean<Integer> del(@Valid DelStationStartVO vo) {
		StationStart t = JSONUtil.trans(vo, StationStart.class);
		return service.delStationStart(t);
	}

}
