package com.jdy.b2b.api.dao;

import com.jdy.b2b.api.model.News;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface NewsMapper {
    int deleteByPrimaryKey(Long id);

    int insert(News record);

    int insertSelective(News record);

    News selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(News record);

    int updateByPrimaryKeyWithBLOBs(News record);

    int updateByPrimaryKey(News record);
}