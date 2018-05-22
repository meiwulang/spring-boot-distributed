package com.jdy.b2b.api.dao;

import com.jdy.b2b.api.model.OrderCard;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface OrderCardMapper {
    int deleteByPrimaryKey(Long id);

    int insert(OrderCard record);

    int insertSelective(OrderCard record);

    OrderCard selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(OrderCard record);

    int updateByPrimaryKey(OrderCard record);

    void batchInsertOrderCards(List<OrderCard> list);

    List<OrderCard> selectCardsByOrderId(@Param("orderId") Long orderId);
}