package com.jdy.b2b.api.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.jdy.b2b.api.model.ProductCostingCategoryDetail;

@Mapper
public interface ProductCostingCategoryDetailMapper {
    int deleteByPrimaryKey(Long id);

    int insert(ProductCostingCategoryDetail record);

    int insertSelective(ProductCostingCategoryDetail record);

    ProductCostingCategoryDetail selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(ProductCostingCategoryDetail record);

    int updateByPrimaryKey(ProductCostingCategoryDetail record);

    int batchInsert(@Param("list")List<ProductCostingCategoryDetail> list,
                    @Param("productCostingTitleId") Long productCostingTitleId);

    int deleteByProductCostingTitleId(@Param("productCostingTitleId") Long productCostingTitleId);
}