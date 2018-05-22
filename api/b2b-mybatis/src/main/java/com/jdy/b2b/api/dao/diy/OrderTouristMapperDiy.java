package com.jdy.b2b.api.dao.diy;

import com.jdy.b2b.api.model.Order;
import com.jdy.b2b.api.model.OrderTourist;
import com.jdy.b2b.api.model.OrderTouristForBatch;
import com.jdy.b2b.api.model.OrderTouristForCS;
import com.jdy.b2b.api.model.diy.OrderTouristAddVO;
import com.jdy.b2b.api.model.diy.OrderTouristDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/9/21 19:13
 */
@Mapper
public interface OrderTouristMapperDiy {

	int batchInsertOrderTourist(List<OrderTouristAddVO> tourists);

	List<OrderTourist> selectList(OrderTourist tourist);

	List<OrderTouristDTO> selectOrderTouristDTOList(Order order);

	List<OrderTourist> getTourists(@Param("orderId") Long orderId,
			@Param("pageNo") int pageNo, @Param("pageSize") int pageSize);

	int getTouristsCount(@Param("orderId") Long orderId);

	List<OrderTouristForCS> getTouristsForChangsha(
			@Param("orderId") Long orderId,
			@Param("isPage") boolean isPage, @Param("pageNo") int pageNo, @Param("pageSize") int pageSize);

	String getTicketName(@Param("id") Long id);

	String getStationName(@Param("id") Long id);

	List<Map> selectTouristByOrderIdAndIDcardInfo(
			@Param("orderId") Long orderId, @Param("otName") String otName,
			@Param("otLicenceType") Integer otLicenceType,
			@Param("otLincese") String otLincese);

	OrderTourist getTouristExtInfoByOrderIdAndTicketType(
			@Param("orderId") Long orderId, @Param("otType") Integer otType);

	int batchUpdateTourist(OrderTouristForBatch vo);
}
