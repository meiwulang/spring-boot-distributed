package com.jdy.b2b.api.dao;

import com.jdy.b2b.api.model.DictionariesGroup;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface DictionariesGroupMapper {
    int deleteByPrimaryKey(Long id);

    int insert(DictionariesGroup record);

    int insertSelective(DictionariesGroup record);

    DictionariesGroup selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(DictionariesGroup record);

    int updateByPrimaryKey(DictionariesGroup record);
}