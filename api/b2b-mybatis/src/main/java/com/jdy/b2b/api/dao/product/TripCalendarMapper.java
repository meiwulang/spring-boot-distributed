package com.jdy.b2b.api.dao.product;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.jdy.b2b.api.model.product.Trip;
import com.jdy.b2b.api.model.product.TripCalendar;

@Mapper
public interface TripCalendarMapper {
	int deleteByPrimaryKey(Long id);

	int insert(TripCalendar record);

	int insertSelective(TripCalendar record);

	TripCalendar selectByPrimaryKey(Long id);

	int updateByPrimaryKeySelective(TripCalendar record);

	int updateByPrimaryKey(TripCalendar record);

	/**
	 * @Description: 批量保存行程日期
	 * @author 王斌
	 * @date 2017年7月20日 下午3:24:07
	 * @param tripCalendars
	 * @param commonDo
	 */
	int batchSave(List<TripCalendar> tripCalendars);

	/**
	 * @Description: 统计总数By ProductId And tcStartDay tcEndDay
	 * @author 王斌
	 * @date 2017年8月17日 下午3:54:10
	 * @param productId
	 * @param tcStartDay
	 * @param tcEndDay
	 * @param trips
	 * @return
	 */
	int countByProductIdAndEffectDay(@Param("productId") Long productId,
			@Param("tcStartDay") String tcStartDay,
			@Param("tcEndDay") String tcEndDay,
			@Param("trips") ArrayList<Trip> trips);

	/**
	 * @Description: 批量更新
	 * @author 王斌
	 * @date 2017年7月21日 下午4:55:45
	 * @param tripCalendars
	 */
	int batchUpdateByPrimaryKeyAndCompanyId(
			LinkedList<TripCalendar> tripCalendars);

	/**
	 * @Description: 批量删除
	 * @author 王斌
	 * @date 2017年7月21日 下午5:23:28
	 * @param tripCalendars
	 */
	int batchDelete(LinkedList<TripCalendar> tripCalendars);

	List<Map<String, Object>> queryByproductId(
			@Param("productId") Long productId);

	// List<Map<String, java.sql.Date>> queryEffectDayByproductId(
	// @Param("productId") Long productId);
}