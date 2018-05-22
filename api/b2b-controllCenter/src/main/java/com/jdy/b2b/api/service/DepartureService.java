package com.jdy.b2b.api.service;

import java.util.Map;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.station.Departure;
import com.jdy.b2b.api.model.station.ShuttleBus;
import com.jdy.b2b.api.vo.station.QueryListForTicketVO;

/**
 * @Description 始发站/出发地管理接口定义层
 * @author 王斌
 * @date 2017年7月14日 下午2:26:15
 * @version V1.0
 */
public interface DepartureService {

	/**
	 * @Description: 班车列表
	 * @author 王斌
	 * @date 2017年7月13日 上午10:17:55
	 * @param sp
	 * @return
	 */
	ResultBean<Map<String, Object>> getShuttleBus(ShuttleBus sp);

	/**
	 * @Description: 出发站/始发站列表
	 * @author 王斌
	 * @date 2017年7月13日 上午10:18:32
	 * @param Departure
	 * @return
	 */
	ResultBean<Map<String, Object>> queryList(Departure Departure);

	/**
	 * @Description: 班车保存
	 * @author 王斌
	 * @date 2017年7月13日 上午10:19:23
	 * @param sp
	 * @param useForBack：应用到返程
	 * @return
	 */
	ResultBean<Map<String, Object>> saveShuttleBus(ShuttleBus sp,
			int useForBack);

	/**
	 * @Description: 班车删除
	 * @author 王斌
	 * @date 2017年7月13日 上午10:19:33
	 * @param sp
	 * @return
	 */
	ResultBean<Map<String, Object>> delShuttleBus(ShuttleBus sp);

	/**
	 * @Description: 为添加票查询列表
	 * @author 王斌
	 * @date 2017年7月10日 下午3:52:38
	 * @param vo
	 * @return
	 */
	Map<String, Object> queryListForTicket(QueryListForTicketVO vo);

	/**
	 * @Description: 保存
	 * @author 王斌
	 * @date 2017年7月10日 下午3:52:28
	 * @param t
	 * @return
	 */

	ResultBean<Map<String, Object>> saveDeparture(Departure departure);

	/**
	 * @Description: 编辑
	 * @author 王斌
	 * @date 2017年7月10日 下午3:52:28
	 * @param t
	 * @return
	 */
    ResultBean<Map<String, Object>> updateDeparture(Departure departure);

	/**
	 * @Description: 删除始发站/出发站
	 * @author 王斌
	 * @date 2017年7月10日 下午3:52:08
	 * @param t
	 * @return
	 */
	ResultBean<Map<String, Object>> delDeparture(Departure t);

	/**
	 * @Description: 编辑班车策略
	 * @author 王斌
	 * @date 2017年7月17日 下午3:38:36
	 * @param sp
	 * @return
	 */
	ResultBean<Map<String, Object>> updateShuttleBus(ShuttleBus sp);

}
