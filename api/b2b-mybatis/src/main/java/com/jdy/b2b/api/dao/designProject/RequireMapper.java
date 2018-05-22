package com.jdy.b2b.api.dao.designProject;

import com.jdy.b2b.api.model.designProject.*;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface RequireMapper {
    int deleteByPrimaryKey(Long id);

    int insert(Require record);

    int insertSelective(Require record);

    Require selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Require record);

    int updateByPrimaryKey(Require record);

    List<RequireDTO> selectRequireList(RequireVO vo);

    List<Require> historyRequireList(Long dId);

    RequireDTO selectRequireDetailDTOById(Long rId);
}