package com.jdy.b2b.api.dao;

import com.jdy.b2b.api.model.OrderPriceDetail;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface OrderPriceDetailMapper {
    int deleteByPrimaryKey(Long id);

    int insert(OrderPriceDetail record);

    int insertSelective(OrderPriceDetail record);

    OrderPriceDetail selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(OrderPriceDetail record);

    int updateByPrimaryKey(OrderPriceDetail record);

    int updateNumById(@Param("orderId") Long orderId, @Param("ticketId") Long ticketId, @Param("num") int num);
}