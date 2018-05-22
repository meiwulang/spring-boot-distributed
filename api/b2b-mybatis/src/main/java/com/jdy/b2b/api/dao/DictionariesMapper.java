package com.jdy.b2b.api.dao;

import com.jdy.b2b.api.model.Dictionaries;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface DictionariesMapper {
    int deleteByPrimaryKey(Long id);

    int insert(Dictionaries record);

    int insertSelective(Dictionaries record);

    Dictionaries selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Dictionaries record);

    int updateByPrimaryKey(Dictionaries record);
}