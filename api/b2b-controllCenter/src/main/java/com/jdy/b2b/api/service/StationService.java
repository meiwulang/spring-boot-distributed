package com.jdy.b2b.api.service;

import java.util.Map;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.station.Station;
import com.jdy.b2b.api.model.station.StationPrice;

/**
 * @Description 出发站业务接口层
 * @author 王斌
 * @date 2017年7月13日 上午10:09:33
 * @version V1.0
 */
public interface StationService {

	/**
	 * @Description: 班车列表
	 * @author 王斌
	 * @date 2017年7月13日 上午10:17:55
	 * @param sp
	 * @return
	 */
	ResultBean<Map<String, Object>> stationPriceDataJson(StationPrice sp);

	/**
	 * @Description: 出发站列表
	 * @author 王斌
	 * @date 2017年7月13日 上午10:18:32
	 * @param station
	 * @return
	 */
	ResultBean<Map<String, Object>> queryList(Station station);

	/**
	 * @Description: 出发站保存
	 * @author 王斌
	 * @date 2017年7月13日 上午10:18:52
	 * @param station
	 * @return
	 */
	ResultBean<Map<String, Object>> save(Station station);

	/**
	 * @Description: 出发站删除
	 * @author 王斌
	 * @date 2017年7月13日 上午10:19:13
	 * @param station
	 * @return
	 */
	ResultBean<Map<String, Object>> del(Station station);

	/**
	 * @Description: 班车保存
	 * @author 王斌
	 * @date 2017年7月13日 上午10:19:23
	 * @param sp
	 * @return
	 */
	ResultBean<Map<String, Object>> stationPriceSave(StationPrice sp);

	/**
	 * @Description: 班车删除
	 * @author 王斌
	 * @date 2017年7月13日 上午10:19:33
	 * @param sp
	 * @return
	 */
	ResultBean<Map<String, Object>> stationPriceDel(StationPrice sp);

}
