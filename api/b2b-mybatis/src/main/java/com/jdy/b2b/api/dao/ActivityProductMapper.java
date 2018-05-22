package com.jdy.b2b.api.dao;

import com.jdy.b2b.api.model.ActivityProduct;

public interface ActivityProductMapper {
    int deleteByPrimaryKey(Long id);

    int insert(ActivityProduct record);

    int insertSelective(ActivityProduct record);

    ActivityProduct selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(ActivityProduct record);

    int updateByPrimaryKey(ActivityProduct record);
}