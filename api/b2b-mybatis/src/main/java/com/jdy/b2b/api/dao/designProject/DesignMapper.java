package com.jdy.b2b.api.dao.designProject;

import com.jdy.b2b.api.model.designProject.Design;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface DesignMapper {
    int deleteByPrimaryKey(Long id);

    int insert(Design record);

    int insertSelective(Design record);

    Design selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Design record);

    int updateByPrimaryKey(Design record);


}