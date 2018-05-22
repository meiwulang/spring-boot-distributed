package com.jdy.b2b.api.dao;

import com.jdy.b2b.api.model.ProductExperience;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ProductExperienceMapper {
    int deleteByPrimaryKey(Long id);

    int insert(ProductExperience record);

    int insertSelective(ProductExperience record);

    ProductExperience selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(ProductExperience record);

    int updateByPrimaryKey(ProductExperience record);
}