package com.jdy.b2b.api.dao;

import com.jdy.b2b.api.model.OrderLogs;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface OrderLogsMapper {
    int deleteByPrimaryKey(Long id);

    int insert(OrderLogs record);

    int insertSelective(OrderLogs record);

    OrderLogs selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(OrderLogs record);

    int updateByPrimaryKey(OrderLogs record);

}