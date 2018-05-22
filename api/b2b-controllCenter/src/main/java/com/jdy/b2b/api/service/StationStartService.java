package com.jdy.b2b.api.service;

import java.util.Map;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.station.StationStart;

/**
 * @Description 始发站业务接口层
 * @author 王斌
 * @date 2017年7月10日 上午9:44:36
 * @version V1.0
 */
public interface StationStartService {
	/**
	 * @Description: 查询列表
	 * @author 王斌
	 * @date 2017年7月10日 下午3:53:11
	 * @param t
	 * @return
	 */
	Map<String, Object> queryList(StationStart t);

	/**
	 * @Description: 为添加票查询列表
	 * @author 王斌
	 * @date 2017年7月10日 下午3:52:38
	 * @param t
	 * @return
	 */
	Map<String, Object> queryListForTicket(StationStart t);

	/**
	 * @Description: 保存或修改
	 * @author 王斌
	 * @date 2017年7月10日 下午3:52:28
	 * @param t
	 * @return
	 */
	ResultBean<Map<String, Object>> saveOrUpdate(StationStart t);

	/**
	 * @Description: 删除始发站
	 * @author 王斌
	 * @date 2017年7月10日 下午3:52:08
	 * @param t
	 * @return
	 */
	ResultBean<Integer> delStationStart(StationStart t);
}
