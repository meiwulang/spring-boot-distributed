package com.jdy.b2b.api.dao.orderOffline;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.jdy.b2b.api.model.diy.OrderPayOfflineDto;
import com.jdy.b2b.api.model.orderOffline.OrderOffline;

@Mapper
public interface OrderOfflineMapper {
	int deleteByPrimaryKey(Long id);

	int insert(OrderOffline record);

	int insertSelective(OrderOffline record);

	OrderOffline selectByPrimaryKey(Long id);

	List<OrderOffline> selectByEntity(OrderOffline entity);

	int updateByPrimaryKeySelective(OrderOffline record);

	int updateByPrimaryKey(OrderOffline record);

	List<OrderOffline> selectByPayId(Long payId);

	List<OrderOffline> selectByOrderId(Long orderId);

	List<OrderPayOfflineDto> selectOrderPayOfflineDtoByOrderId(Long orderId);

	BigDecimal selectMaxMoney(@Param("orderId") Long orderId,
			@Param("type") Integer type);

	HashMap<String, BigDecimal> selectSumFirstPay(Long id);

	int getExistRecordByIds(@Param("list") List<Long> ids,@Param("orderId") Long id);
}