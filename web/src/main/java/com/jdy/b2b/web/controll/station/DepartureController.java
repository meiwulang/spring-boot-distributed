package com.jdy.b2b.web.controll.station;

import com.jdy.b2b.web.pojo.log.MyLog;
import com.jdy.b2b.web.pojo.station.QueryListForTicketVO;
import com.jdy.b2b.web.pojo.station.StationPriceVO;
import com.jdy.b2b.web.pojo.station.StationVO;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;
import com.jdy.b2b.web.util.annotations.Delete;
import com.jdy.b2b.web.util.annotations.Query;
import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@SuppressWarnings("unchecked")
@Api(description = "出发站/始发站接口")
public class DepartureController extends BaseController {

	/**
	 * @Description: 出发站/始发站列表
	 * @author 王斌
	 * @date 2017年7月13日 上午10:06:28
	 * @param vo
	 * @return
	 */
	@RequestMapping(value = "departure/list", method = RequestMethod.POST)
	@ApiOperation("出发站/始发站列表")
	public ResultBean<Map<String, Object>> queryList(
			@Validated(Query.class) @RequestBody StationVO vo) {
		vo.setCompanyId(vo.getPcompanyId());
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("departure/list");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class)
				.getBody();
	}

	/**
	 * @Description: 出发站/始发站保存
	 * @author 王斌
	 * @date 2017年7月13日 上午10:06:54
	 * @param vo
	 * @return
	 */
	@RequestMapping(value = "departure/save", method = RequestMethod.POST)
	@ApiOperation("出发站/始发站保存")
	@MyLog(Module = "departure")
	public ResultBean<Map<String, Object>> saveDeparture(
			@Validated(Save.class) @RequestBody StationVO vo) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("departure/save");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class)
				.getBody();
	}

	/**
	 * @Description: 出发站/始发站编辑
	 * @author 王斌
	 * @date 2017年7月13日 上午10:06:54
	 * @param vo
	 * @return
	 */
	@RequestMapping(value = "departure/update", method = RequestMethod.POST)
	@ApiOperation("出发站/始发站编辑")
	@MyLog(Module = "departure")
	public ResultBean<Map<String, Object>> updateDeparture(
			@Validated(Update.class) @RequestBody StationVO vo) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("departure/update");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class)
				.getBody();
	}

	/**
	 * @Description: 出发站/始发站删除
	 * @author 王斌
	 * @date 2017年7月13日 上午10:07:36
	 * @param vo
	 * @return
	 */
	@RequestMapping(value = "departure/del", method = RequestMethod.POST)
	@ApiOperation("出发站/始发站删除")
	@MyLog(Module = "departure")
	public ResultBean<Map<String, Object>> del(
			@Validated(Delete.class) @RequestBody StationVO vo) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("departure/del");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class)
				.getBody();
	}

	/**
	 * @Description: 班车列表
	 * @author 王斌
	 * @date 2017年7月13日 上午10:07:51
	 * @param vo
	 * @return
	 */
	@RequestMapping(value = "shuttle_bus/list", method = RequestMethod.POST)
	@ApiOperation("班车列表")
	public ResultBean<Map<String, Object>> getShuttleBus(
			@Validated(Query.class) @RequestBody StationPriceVO vo) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("shuttle_bus/list");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class)
				.getBody();
	}

	/**
	 * @Description: 班车保存
	 * @author 王斌
	 * @date 2017年7月13日 上午10:08:10
	 * @param vo
	 * @return
	 */
	@RequestMapping(value = "shuttle_bus/save", method = RequestMethod.POST)
	@ApiOperation("班车保存")
	@MyLog(Module = "shuttle_bus")
	public ResultBean<Map<String, Object>> SaveShuttleBus(
			@Validated(Save.class) @RequestBody StationPriceVO vo) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("shuttle_bus/save");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class)
				.getBody();
	}

	/**
	 * @Description: 班车编辑
	 * @author 王斌
	 * @date 2017年7月13日 上午10:08:10
	 * @param vo
	 * @return
	 */
	@RequestMapping(value = "shuttle_bus/update", method = RequestMethod.POST)
	@ApiOperation("班车编辑")
	@MyLog(Module = "shuttle_bus")
	public ResultBean<Map<String, Object>> updateShuttleBus(
			@Validated(Update.class) @RequestBody StationPriceVO vo) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("shuttle_bus/update");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class)
				.getBody();
	}

	/**
	 * @Description: 班车删除
	 * @author 王斌
	 * @date 2017年7月13日 上午10:09:03
	 * @param vo
	 * @return
	 */
	@RequestMapping(value = "shuttle_bus/del", method = RequestMethod.POST)
	@ApiOperation("班车删除")
	@MyLog(Module = "shuttle_bus")
	public ResultBean<Map<String, Object>> stationPriceDel(
			@Validated(Delete.class) @RequestBody StationPriceVO vo) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("shuttle_bus/del");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class)
				.getBody();
	}

	// 始发站列表for新增票
	@RequestMapping(value = "departure/start_site_group", method = RequestMethod.POST)
	@ApiOperation("新增票页查询始发站列表")
	public ResultBean<Map<String, Object>> queryListForTicket(
			@Validated(Query.class) @RequestBody QueryListForTicketVO vo) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("departure/start_site_group");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class)
				.getBody();
	}
}