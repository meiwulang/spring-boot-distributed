package com.jdy.b2b.api.dao.label;

import com.jdy.b2b.api.model.label.Label;
import com.jdy.b2b.api.model.label.LabelDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface LabelMapper {
    int deleteByPrimaryKey(Long id);

    int insert(Label record);

    int insertSelective(Label record);

    Label selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Label record);

    int updateByPrimaryKey(Label record);
	
	/*自定义*/

    List<LabelDTO> queryLabelListForPage(Label label);
}