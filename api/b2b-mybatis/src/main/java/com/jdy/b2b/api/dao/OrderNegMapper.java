package com.jdy.b2b.api.dao;

import com.jdy.b2b.api.model.OrderNeg;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface OrderNegMapper {
    int deleteByPrimaryKey(Long id);

    int insert(OrderNeg record);

    int insertSelective(OrderNeg record);

    OrderNeg selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(OrderNeg record);

    int updateByPrimaryKey(OrderNeg record);
}