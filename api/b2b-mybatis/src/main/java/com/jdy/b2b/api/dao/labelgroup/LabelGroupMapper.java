package com.jdy.b2b.api.dao.labelgroup;

import com.jdy.b2b.api.model.labelgroup.LabelGroup;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface LabelGroupMapper {
    int deleteByPrimaryKey(Long id);

    int insert(LabelGroup record);

    int insertSelective(LabelGroup record);

    LabelGroup selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(LabelGroup record);

    int updateByPrimaryKey(LabelGroup record);

    List<LabelGroup> queryForLabelGroupList(LabelGroup vo);
}