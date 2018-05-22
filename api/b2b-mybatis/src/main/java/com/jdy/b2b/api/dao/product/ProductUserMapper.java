package com.jdy.b2b.api.dao.product;

import com.jdy.b2b.api.model.fingercrm.ProductUser;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ProductUserMapper {
    int deleteByPrimaryKey(Long id);

    int insert(ProductUser record);

    int insertSelective(ProductUser record);

    ProductUser selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(ProductUser record);

    int updateByPrimaryKey(ProductUser record);

    int deleteByPNoAndCategroyId(@Param("productId") Long productId, @Param("categoryId") Long categoryId,@Param("companyId") Long companyId);

    int insertBatch(@Param("list") List<ProductUser> insertList);

    List<ProductUser> selectRelByPIdExcludeCategoryId(@Param("productId") Long productId,@Param("categoryId") Long categoryId);
}