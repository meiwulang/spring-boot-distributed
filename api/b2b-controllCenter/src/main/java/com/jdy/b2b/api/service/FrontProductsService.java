package com.jdy.b2b.api.service;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.vo.product.FrontProductVO;
import com.jdy.b2b.api.vo.product.FrontStationVO;

/**
 * @Description 门户产品业务层
 * @author 王斌
 * @date 2017年9月19日 下午3:55:20
 * @version V1.0
 */
public interface FrontProductsService {
	/**
	 * @Description:首页产品分组列表
	 * @author 王斌
	 * @date 2017年9月19日 下午3:59:01
	 * @param type
	 * @param start
	 * @param city_code
	 * @return
	 */
	ResultBean<?> buslist(String type, int start, String city_code);

	/**
	 * @Description: 产品详情接口
	 * @author 王斌
	 * @date 2017年9月19日 下午3:59:05
	 * @param p_id
	 * @param start_date
	 * @param city_code
	 * @param openId
	 * @param companyId
	 * @return
	 */
	ResultBean<?> detail(Long p_id, String start_date, String city_code,
			String from, String openId, Long companyId);

	/**
	 * @Description: 获取产品相关信息
	 * @author 王斌
	 * @date 2017年9月19日 下午3:59:08
	 * @param p_id
	 * @param bl_id
	 * @param sign
	 * @param time_stamp
	 * @param city_code
	 * @return
	 */
	ResultBean<?> info(Integer p_id, Integer bl_id, String sign,
			String time_stamp, String city_code);

	/**
	 * @Description: 产品列表接口
	 * @author 王斌
	 * @date 2017年9月19日 下午5:23:47
	 * @param start
	 * @param city_code
	 * @param limit
	 * @param type
	 * @return
	 */
	ResultBean<?> lists(Integer start, String city_code, Integer limit,
			String type);

	/**
	 * @Description: TODO
	 * @author 王斌
	 * @date 2017年9月21日 下午7:12:36
	 * @param vo
	 * @return
	 */
	ResultBean<?> appPdtlists(FrontProductVO vo);

	/**
	 * @Description: TODO
	 * @author 王斌
	 * @date 2017年9月21日 下午8:08:27
	 * @param source
	 * @param city_code
	 * @param openid
	 * @return
	 */
	ResultBean<?> wap_buslist(String source, String city_code, String openid,
			Integer dataLimit, Long CompanyId);

	ResultBean<?> station(FrontStationVO vo);

	/**
	 * @Description: TODO
	 * @author 王斌
	 * @date 2017年9月29日 上午11:26:03
	 * @param p_id
	 * @param city_code
	 * @return
	 */
	ResultBean<?> getCalendarMonths(Long p_id, String city_code);
}
