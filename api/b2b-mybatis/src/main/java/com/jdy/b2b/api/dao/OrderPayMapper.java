package com.jdy.b2b.api.dao;

import com.jdy.b2b.api.model.OrderPay;
import com.jdy.b2b.api.model.bill.OrderPayWithOrderDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface OrderPayMapper {
    int deleteByPrimaryKey(Long id);

    int insert(OrderPay record);

    int insertSelective(OrderPay record);

    OrderPay selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(OrderPay record);

    int updateByPrimaryKey(OrderPay record);

    List<OrderPayWithOrderDto> selectBeforeNowNotMergeList(String date);

    int updateBeforeNowNotMergeList(String now);
}