package com.jdy.b2b.api.dao;

import com.jdy.b2b.api.model.ActivityArea;

public interface ActivityAreaMapper {
    int deleteByPrimaryKey(Long id);

    int insert(ActivityArea record);

    int insertSelective(ActivityArea record);

    ActivityArea selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(ActivityArea record);

    int updateByPrimaryKey(ActivityArea record);
}