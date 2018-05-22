package com.jdy.b2b.api.dao.product;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.jdy.b2b.api.model.product.Trip;

@Mapper
public interface TripMapper {
	int deleteByPrimaryKey(Long id);

	int insert(Trip record);

	int insertSelective(Trip record);

	Trip selectByPrimaryKey(Long id);

	int updateByPrimaryKeySelective(Trip record);

	int updateByPrimaryKeyWithBLOBs(Trip record);

	int updateByPrimaryKey(Trip record);

	int batchUpdateByPrimaryKeyAndCompanyId(List<Trip> list);

	/**
	 * @Description: 批量插入行程
	 * @author 王斌
	 * @date 2017年7月20日 下午2:46:33
	 * @param trips
	 * @param tripType
	 * @param productId
	 */
	int batchSave(List<Trip> trips);

	/**
	 * @Description: 批量删除行程
	 * @author 王斌
	 * @date 2017年7月20日 下午2:46:33
	 * @param trips
	 * @param tripType
	 * @param productId
	 */
	int batchDelete(@Param("productId") Long productId,
			@Param("tcStartDay") String tcStartDay,
			@Param("tcEndDay") String tcEndDay);

	/**
	 * @Description: 删除默认行程
	 * @author 王斌
	 * @date 2017年8月18日 上午11:18:29
	 * @param trips
	 * @return
	 */
	int batchDeleteDefaultTrips(List<Trip> trips);

	/**
	 * @Description: 统计总数By ProductId And Type
	 * @author 王斌
	 * @date 2017年7月21日 上午11:30:33
	 * @param record
	 * @return
	 */
	int countByProductIdAndType(@Param("productId") Long productId,
			@Param("type") Integer type);

	/**
	 * @Description: 按产品和类型查行程
	 * @author 王斌
	 * @date 2017年7月24日 下午2:36:18
	 * @param productId
	 * @return
	 */
	List<Map<String, Object>> queryByProductIdAndType(
			@Param("productId") Long productId, @Param("type") Integer type);

	/**
	 * @Description: 查询补充行程
	 * @author 王斌
	 * @date 2017年8月17日 下午5:15:37
	 * @param productId
	 * @param tcStartDay
	 * @param tcEndDay
	 * @return
	 */
	List<Map<String, Object>> queryByProductIdAndStartAndEndDate(
			@Param("productId") Long productId,
			@Param("tcStartDay") String tcStartDay,
			@Param("tcEndDay") String tcEndDay);

	List<Map<String, Object>> queryTripBaseInfo(
			@Param("productId") Long productId, @Param("type") Integer type);
}