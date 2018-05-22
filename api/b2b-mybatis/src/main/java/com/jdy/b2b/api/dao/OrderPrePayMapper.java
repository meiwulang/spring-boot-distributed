package com.jdy.b2b.api.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.jdy.b2b.api.model.OrderPrePayDO;

@Mapper
public interface OrderPrePayMapper {
    int deleteByPrimaryKey(Long id);

    int insert(OrderPrePayDO record);

    int insertSelective(OrderPrePayDO record);

    OrderPrePayDO selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(OrderPrePayDO record);

    int updateByPrimaryKey(OrderPrePayDO record);

    int deleteByOrderNo(@Param("orderNo") String OrderNo);

    OrderPrePayDO selectByOrderNo(@Param("orderNo") String OrderNo);
}