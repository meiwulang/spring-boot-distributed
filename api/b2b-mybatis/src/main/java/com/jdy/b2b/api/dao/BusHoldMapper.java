package com.jdy.b2b.api.dao;

import com.jdy.b2b.api.model.BusHold;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface BusHoldMapper {
    int deleteByPrimaryKey(Long id);

    int insert(BusHold record);

    int insertSelective(BusHold record);

    BusHold selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(BusHold record);

    int updateByPrimaryKey(BusHold record);
}