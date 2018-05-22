package com.jdy.b2b.api.service;

import com.jdy.b2b.api.model.position.Position;
import com.jdy.b2b.api.model.position.PositionListParam;
import com.jdy.b2b.api.model.position.PositionVO;

import java.util.List;

/**
 * Created by dugq on 2018/3/24.
 */
public interface PositionService {
    int deleteByPrimaryKey(Long id);

    int insert(Position record);

    int insertSelective(Position record);

    Position selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Position record);

    int updateByPrimaryKey(Position record);

    List<PositionVO> selectListByCompanyId(PositionListParam param);
}
