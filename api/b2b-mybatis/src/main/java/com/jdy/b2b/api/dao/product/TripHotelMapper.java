package com.jdy.b2b.api.dao.product;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.jdy.b2b.api.model.product.Trip;
import com.jdy.b2b.api.model.product.TripHotel;
import com.jdy.b2b.api.model.product.TripHotelDTO;

@Mapper
public interface TripHotelMapper {
	int deleteByPrimaryKey(Long id);

	int insert(TripHotel record);

	int insertSelective(TripHotel record);

	TripHotel selectByPrimaryKey(Long id);

	int updateByPrimaryKeySelective(TripHotel record);

	int updateByPrimaryKey(TripHotel record);

	/**
	 * @Description: 批量保存
	 * @author 王斌
	 * @date 2017年7月20日 下午4:30:57
	 * @param tripHotels
	 * @param commonDo
	 */
	int batchSave(List<TripHotel> tripHotels);

	/**
	 * @Description: 批量更新
	 * @author 王斌
	 * @date 2017年7月21日 下午5:02:08
	 * @param tripHotels
	 */
	int batchUpdateByPrimaryKey(LinkedList<TripHotel> tripHotels);

	/**
	 * @Description: 批量删除
	 * @author 王斌
	 * @date 2017年7月21日 下午5:15:31
	 * @param tripHotels
	 */
	int batchDelete(ArrayList<Trip> trips);

	List<TripHotelDTO> queryHotelByTripId(@Param("tripId") Long tripId);

}