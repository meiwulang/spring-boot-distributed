package com.jdy.b2b.api.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.jdy.b2b.api.common.BaseVO;
import com.jdy.b2b.api.common.JSONUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.common.constants.annotations.Delete;
import com.jdy.b2b.api.common.constants.annotations.Query;
import com.jdy.b2b.api.common.constants.annotations.Save;
import com.jdy.b2b.api.common.constants.annotations.Update;
import com.jdy.b2b.api.model.product.BaseDO;
import com.jdy.b2b.api.model.station.Departure;
import com.jdy.b2b.api.model.station.ShuttleBus;
import com.jdy.b2b.api.service.DepartureService;
import com.jdy.b2b.api.vo.station.QueryListForTicketVO;
import com.jdy.b2b.api.vo.station.StationPriceVO;
import com.jdy.b2b.api.vo.station.StationVO;

/**
 * @Description 出发站/始发站控制层
 * @author 王斌
 * @date 2017年7月13日 上午9:49:50
 * @version V1.0
 */
@SuppressWarnings("unchecked")
@RestController
public class DepartureController {
	@Autowired
	private DepartureService service;

	/**
	 * @Description: 出发站/始发站列表
	 * @author 王斌
	 * @date 2017年7月13日 上午10:06:28
	 * @param vo
	 * @return
	 */
	@RequestMapping(value = "departure/list", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> queryList(
			@Validated(Query.class) @RequestBody StationVO vo) {
		Departure station = JSONUtil.trans(vo, Departure.class);
		return service.queryList(station);
	}

	/**
	 * @Description: 出发站/始发站保存
	 * @author 王斌
	 * @date 2017年7月13日 上午10:06:54
	 * @param vo
	 * @return
	 */

	@RequestMapping(value = "departure/save", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> saveDeparture(
			@Validated(Save.class) @RequestBody StationVO vo) {
		// Object validatePromision = validatePromision(vo);
		// if (Objects.nonNull(validatePromision)) {
		// return (ResultBean<Map<String, Object>>) validatePromision;
		// }
		Departure station = JSONUtil.trans(vo, Departure.class);
		initUpdateAndCreateUser(vo, station);
		return service.saveDeparture(station);
	}

	// private Object validatePromision(StationVO vo) {
	// if (!Objects.equals(vo.getPcType(), Integer.valueOf(2))
	// && Objects.equals(vo.getdType(), Integer.valueOf(0))
	// && !Objects.equals(vo.getdTraffic(), Integer.valueOf(2))) {
	// return new ResultBean<>(Constants.Error.COMMON_ERROR_CODE,
	// Constants.Error.INSUFFICIENT_AUTHORITY_FOR_ACID);
	// }
	// return null;
	// }

	/**
	 * @Description: 出发站/始发站编辑
	 * @author 王斌
	 * @date 2017年7月13日 上午10:06:54
	 * @param vo
	 * @return
	 */
	@RequestMapping(value = "departure/update", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> updateDeparture(
			@Validated(Update.class) @RequestBody StationVO vo) {
		// Object validatePromision = validatePromision(vo);
		// if (Objects.nonNull(validatePromision)) {
		// return (ResultBean<Map<String, Object>>) validatePromision;
		// }
		Departure station = JSONUtil.trans(vo, Departure.class);
		initUpdateUser(vo, station);
		return service.updateDeparture(station);
	}

	/**
	 * @Description: 出发站/始发站删除
	 * @author 王斌
	 * @date 2017年7月13日 上午10:07:36
	 * @param vo
	 * @return
	 */
	@RequestMapping(value = "departure/del", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> del(
			@Validated(Delete.class) @RequestBody StationVO vo) {
		Departure station = JSONUtil.trans(vo, Departure.class);
		station.setUpdateUser(vo.getPuserId());
		return service.delDeparture(station);
	}

	/**
	 * @Description: 班车列表
	 * @author 王斌
	 * @date 2017年7月13日 上午10:07:51
	 * @param vo
	 * @return
	 */
	@RequestMapping(value = "shuttle_bus/list", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> getShuttleBus(
			@Validated(Query.class) @RequestBody StationPriceVO vo) {
		ShuttleBus sp = JSONUtil.trans(vo, ShuttleBus.class);
		return service.getShuttleBus(sp);
	}

	/**
	 * @Description: 班车保存
	 * @author 王斌
	 * @date 2017年7月13日 上午10:08:10
	 * @param vo
	 * @return
	 */
	@RequestMapping(value = "shuttle_bus/save", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> SaveShuttleBus(
			@Validated(Save.class) @RequestBody StationPriceVO vo) {
		ShuttleBus sp = JSONUtil.trans(vo, ShuttleBus.class);
		initUpdateAndCreateUser(vo, sp);
		return service.saveShuttleBus(sp, vo.getUseForBack());
	}

	/**
	 * @Description: 班车编辑
	 * @author 王斌
	 * @date 2017年7月13日 上午10:08:10
	 * @param vo
	 * @return
	 */
	@RequestMapping(value = "shuttle_bus/update", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> updateShuttleBus(
			@Validated(Update.class) @RequestBody StationPriceVO vo) {
		ShuttleBus sp = JSONUtil.trans(vo, ShuttleBus.class);
		initUpdateUser(vo, sp);
		return service.updateShuttleBus(sp);
	}

	/**
	 * @Description: 班车删除
	 * @author 王斌
	 * @date 2017年7月13日 上午10:09:03
	 * @param vo
	 * @return
	 */
	@RequestMapping(value = "shuttle_bus/del", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> stationPriceDel(
			@Validated(Delete.class) @RequestBody StationPriceVO vo) {
		ShuttleBus sp = JSONUtil.trans(vo, ShuttleBus.class);
		initUpdateUser(vo, sp);
		return service.delShuttleBus(sp);
	}

	// 始发站列表for新增票
	@RequestMapping(value = "departure/start_site_group", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> queryListForTicket(
			@Validated(Query.class) @RequestBody QueryListForTicketVO vo) {
		return ResultBean.getSuccessResult(service.queryListForTicket(vo));
	}

	// 处理操作人
	private void initUpdateAndCreateUser(BaseVO vo, BaseDO baseDO) {
		baseDO.setCreateUser(vo.getPuserId());
		baseDO.setUpdateUser(vo.getPuserId());
	}

	// 处理操作人
	private void initUpdateUser(BaseVO vo, BaseDO baseDO) {
		baseDO.setUpdateUser(vo.getPuserId());
	}
}
