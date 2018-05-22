package com.jdy.b2b.api.service;

import com.jdy.b2b.api.model.marketArea.MarketArea;

/**
 * Created by dugq on 2017/8/11.
 */
public interface MarketAreaService {
    int deleteByPrimaryKey(Long id);

    int insert(MarketArea record);

    int insertSelective(MarketArea record);

    MarketArea selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(MarketArea record);

    int updateByPrimaryKey(MarketArea record);

    int addNewRelative(long id,String sets);

    int removeByCompanyId(long id);

    int updateByCompanyId(long companyId,String sets);
}
