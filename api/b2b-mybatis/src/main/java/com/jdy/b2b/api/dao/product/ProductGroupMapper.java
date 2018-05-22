package com.jdy.b2b.api.dao.product;

import com.jdy.b2b.api.model.fingercrm.ProductGroup;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ProductGroupMapper {
    int deleteByPrimaryKey(Long id);

    int insert(ProductGroup record);

    int insertSelective(ProductGroup record);

    ProductGroup selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(ProductGroup record);

    int updateByPrimaryKey(ProductGroup record);

    int insertBatch(@Param("list") List<ProductGroup> productGroupList);

    int deleteByPNo(Long id);

    int deleteByPNoAndCatagroyIdAndCompanyIdAndGNo(@Param("pId")Long productId, @Param("categroyId") Long catagroyId, @Param("companyId") Long companyId,@Param("list") List<String> gNos);

    int deleteByTid(Long id);

    List<ProductGroup> selectRelByPIdExcludeCategoryId(@Param("productId") Long productId,@Param("categoryId") Long categoryId);
}