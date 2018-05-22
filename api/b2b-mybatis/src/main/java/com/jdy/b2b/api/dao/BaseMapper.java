package com.jdy.b2b.api.dao;


import com.jdy.b2b.api.model.Base;

public interface BaseMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(Base record);

    int insertSelective(Base record);

    Base selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(Base record);

    int updateByPrimaryKey(Base record);
}