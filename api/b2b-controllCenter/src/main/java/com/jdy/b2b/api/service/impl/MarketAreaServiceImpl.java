package com.jdy.b2b.api.service.impl;

import com.jdy.b2b.api.dao.marketArea.MarketAreaMapper;
import com.jdy.b2b.api.model.marketArea.MarketArea;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;
import java.util.function.BiFunction;
import java.util.function.BinaryOperator;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Created by dugq on 2017/8/11.
 */
@Service
@Transactional
public class MarketAreaServiceImpl implements com.jdy.b2b.api.service.MarketAreaService {
    @Autowired
    private MarketAreaMapper marketAreaMapper;

    @Override
    public int deleteByPrimaryKey(Long id) {
        return marketAreaMapper.deleteByPrimaryKey(id);
    }
    @Override
    public int insert(MarketArea record) {
        return marketAreaMapper.insert(record);
    }
    @Override
    public int insertSelective(MarketArea record) {
        return marketAreaMapper.insertSelective(record);
    }
    @Override
    public MarketArea selectByPrimaryKey(Long id) {
        return marketAreaMapper.selectByPrimaryKey(id);
    }
    @Override
    public int updateByPrimaryKeySelective(MarketArea record) {
        return marketAreaMapper.updateByPrimaryKeySelective(record);
    }
    @Override
    public int updateByPrimaryKey(MarketArea record) {
        return marketAreaMapper.updateByPrimaryKey(record);
    }

    @Override
    public int addNewRelative(long id ,String sets) {
        if(StringUtils.isBlank(sets)){
            return 0;
        }
        String[] split = sets.split(",");
        if(ArrayUtils.isEmpty(split)){
            return 0;
        }
        LinkedList<MarketArea> marketAreaList = new LinkedList<>();
        Stream.of(split).forEach(str -> {
            marketAreaList.add(new MarketArea(id,str));
        });
        return marketAreaMapper.insertList(marketAreaList);
    }

    @Override
    public int removeByCompanyId(long id) {
        return marketAreaMapper.removeByCompanyId(id);
    }

    @Override
    public int updateByCompanyId(long companyId, String sets) {
        if(StringUtils.isBlank(sets)){
            return marketAreaMapper.removeByCompanyId(companyId);
        }
        marketAreaMapper.removeByCompanyId(companyId);
        String[] split = sets.split(",");
        List<MarketArea> insertList = Stream.of(split).map(str -> new MarketArea(companyId, str)).collect(Collectors.toList());
        int i = marketAreaMapper.insertList(insertList);
        return i;
    }
}
