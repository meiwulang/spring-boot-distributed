package com.jdy.b2b.api.service.impl;

import com.github.pagehelper.PageHelper;
import com.jdy.b2b.api.dao.PositionMapper;
import com.jdy.b2b.api.model.position.Position;
import com.jdy.b2b.api.model.position.PositionListParam;
import com.jdy.b2b.api.model.position.PositionVO;
import com.jdy.b2b.api.service.PositionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by dugq on 2018/3/24.
 */
@Service
public class PositionServiceImpl implements PositionService {
    @Autowired
    private PositionMapper positionMapper;

    @Override
    public int deleteByPrimaryKey(Long id) {
        return positionMapper.deleteByPrimaryKey(id);
    }

    @Override
    public int insert(Position record) {
        return positionMapper.insert(record);
    }

    @Override
    public int insertSelective(Position record) {
        return positionMapper.insertSelective(record);
    }

    @Override
    public Position selectByPrimaryKey(Long id) {
        return positionMapper.selectByPrimaryKey(id);
    }

    @Override
    public int updateByPrimaryKeySelective(Position record) {
        return positionMapper.updateByPrimaryKeySelective(record);
    }

    @Override
    public int updateByPrimaryKey(Position record) {
        return positionMapper.updateByPrimaryKey(record);
    }

    @Override
    public List<PositionVO> selectListByCompanyId(PositionListParam param) {
        PageHelper.startPage(param.getPageIndex(),20);
        return positionMapper.selectByCompanyId(param.getCompanyId(),param.getSearchParam());
    }
}
