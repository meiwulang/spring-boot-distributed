package com.jdy.b2b.api.dao.product;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.jdy.b2b.api.model.product.FrontAppProduct;
import com.jdy.b2b.api.model.product.FrontProduct;
import com.jdy.b2b.api.model.station.AppStation;

@Mapper
public interface FrontProductMapper {
	/**
	 * @Description:首页产品分组列表
	 * @author 王斌
	 * @date 2017年9月19日 下午3:59:01
	 * @param type
	 * @param start
	 * @param city_code
	 * @return
	 */
	List<Map<String, Object>> buslist(String type, int start, String city_code);

	/**
	 * @Description: 产品详情接口
	 * @author 王斌
	 * @date 2017年9月19日 下午3:59:05
	 * @param p_id
	 * @param start_date
	 * @param city_code
	 * @return
	 */
	FrontProduct detail(@Param("p_id") Long p_id,
			@Param("start_date") String start_date,
			@Param("city_code") String city_code);

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
	Map<String, Object> info(Integer p_id, Integer bl_id, String sign,
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
	List<Map<String, Object>> lists(Integer start, String city_code,
			Integer limit, String type);

	List<Map<String, Object>> getStartPlaceDetail(Long pid);

	List<String> getStartPlace(Long pid);

	List<Long> getProductIdsByOpenId(@Param("openId") String openId);

	List<Long> getProductIdsByIdsAndCompany(@Param("ids") List<Long> ids,
			@Param("companyId") Long companyId);

	List<Long> getTicketsByOpenId(@Param("openId") String openId);

	List<Map<String, Object>> getTicket(Long pid);

	List<String> getSlideImg(Long pid);

	List<Map<String, Object>> appPdtlists(FrontAppProduct vo);

	List<Map<String, Object>> wapBuslist(@Param("source") String source,
			@Param("city_code") String city_code,
			@Param("pIds") List<Long> pIds, @Param("tIds") List<Long> tIds);

	List<Map<String, Object>> startStations(AppStation obj);

	List<Map<String, Object>> stationAndTickets(
			@Param("p_ids") List<Long> p_ids,
			@Param("start_date") String start_date,
			@Param("end_date") String end_date,
			@Param("goDateTime") String goDateTime);

	String selectBusList(@Param("p_id") Long p_id);

	Map<String, Object> getAdultTicket(@Param("p_id") Long p_id,
			@Param("from") String from, @Param("openId") String openId);

	/**
	 * @Description: 获取直客类目的最低成人票
	 * @author 王斌
	 * @date 2018年1月16日 下午4:26:40
	 * @param p_id
	 * @return
	 */
	Map<String, Object> getAdultZhiKeMinTicket(@Param("p_id") Long p_id);

	/**
	 * @Description: 最低票价
	 * @author 王斌
	 * @date 2018年1月19日 上午9:59:45
	 * @param p_id
	 * @param companyId
	 * @return
	 */
	Map<String, Object> getMinTicket(@Param("p_id") Long p_id,
			@Param("companyId") Long companyId);

	/**
	 * @Description: 获取最低成人票
	 * @author 王斌
	 * @date 2018年1月16日 下午4:27:09
	 * @param p_id
	 * @return
	 */
	Map<String, Object> getAdultMinTicket(@Param("p_id") Long p_id);

	/**
	 * @Description: 获取最低儿童票
	 * @author 王斌
	 * @date 2018年1月16日 下午4:27:23
	 * @param p_id
	 * @return
	 */
	Map<String, Object> getChildMinTicket(@Param("p_id") Long p_id);

	Map<String, Object> getChildrenTicket(@Param("p_id") Long p_id);

	Map<String, Object> getPackageTicket(@Param("p_id") Long p_id);

	Map<String, Object> getProdudtRoute(@Param("p_id") Long p_id);

	List<Map<String, Object>> getBusList(@Param("p_id") Long p_id,
			@Param("from") String from, @Param("openId") String openId,
			@Param("companyId") Long companyId);

	List<Map<String, Object>> getCalendarMonth(@Param("p_id") Long p_id,
			@Param("city_code") String city_code);

	String getLeaveTime(@Param("bl_id") Long sc_id);

	/**
	 * @Description: 查询套票的单票
	 * @author 王斌
	 * @date 2017年10月24日 下午6:30:35
	 * @param tickets
	 * @return
	 */
	List<String> getAllSingleTickets(List<String> tickets);

	/**
	 * @Description: 从新表中查询人员和票的关系
	 * @author 王斌
	 * @date 2018年1月3日 下午4:46:15
	 * @param openid
	 * @return
	 */
	List<Long> getTicketsByOpenIdInProductUserTable(
			@Param("openid") String openid);

	/**
	 * @Description: 查询产品基本信息列表
	 * @author 王斌
	 * @param gNO
	 *            虚拟分组
	 * @date 2018年1月16日 下午3:03:26
	 * @param pid
	 * @return
	 */
	List<Map<String, Object>> getProductBasicInfoByOpenId(
			@Param("openid") String openid, @Param("gno") String gNO);

	/**
	 * @Description: 查询产品最低票信息
	 * @author 王斌
	 * @date 2018年1月16日 下午3:03:26
	 * @param pid
	 * @return
	 */
	BigDecimal getProductsMinTicket(@Param("pid") Long pid);
	int countGroupInfo(@Param("openId")String openId);

}