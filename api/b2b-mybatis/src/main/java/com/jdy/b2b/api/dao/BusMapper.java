package com.jdy.b2b.api.dao;

import com.jdy.b2b.api.model.Bus;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface BusMapper {
    int deleteByPrimaryKey(Long id);

    int insert(Bus record);

    int insertSelective(Bus record);

    Bus selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Bus record);

    int updateByPrimaryKey(Bus record);
}