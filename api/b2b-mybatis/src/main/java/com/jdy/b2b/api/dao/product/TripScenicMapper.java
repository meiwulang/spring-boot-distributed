package com.jdy.b2b.api.dao.product;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.jdy.b2b.api.model.product.Trip;
import com.jdy.b2b.api.model.product.TripScenic;
import com.jdy.b2b.api.model.product.TripScenicDTO;

@Mapper
public interface TripScenicMapper {
	int deleteByPrimaryKey(Long id);

	int insert(TripScenic record);

	int insertSelective(TripScenic record);

	TripScenic selectByPrimaryKey(Long id);

	int updateByPrimaryKeySelective(TripScenic record);

	int updateByPrimaryKey(TripScenic record);

	/**
	 * @Description: 批量保存
	 * @author 王斌
	 * @date 2017年7月20日 下午4:31:33
	 * @param tripScenics
	 * @param commonDo
	 */
	int batchSave(List<TripScenic> tripScenics);

	/**
	 * @Description: 批量更新
	 * @author 王斌
	 * @date 2017年7月21日 下午5:00:33
	 * @param tripHotels
	 */
	int batchUpdateByPrimaryKey(LinkedList<TripScenic> tripHotels);

	/**
	 * @Description: 批量删除
	 * @author 王斌
	 * @date 2017年7月21日 下午5:20:56
	 * @param tripScenics
	 */
	void batchDelete(ArrayList<Trip> trips);

	/**
	 * @Description: 查询行程景点
	 * @author 王斌
	 * @date 2017年7月24日 下午2:55:46
	 * @param tripId
	 * @return
	 */
	List<TripScenicDTO> queryScenicByTripId(@Param("tripId") Long tripId);
}