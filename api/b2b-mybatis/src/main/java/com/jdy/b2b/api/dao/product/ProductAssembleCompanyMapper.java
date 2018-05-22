package com.jdy.b2b.api.dao.product;

import com.jdy.b2b.api.model.product.ProductAssembleCompany;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
@Mapper
public interface ProductAssembleCompanyMapper {
    int deleteByPrimaryKey(Long id);

    int insert(ProductAssembleCompany record);

    int insertSelective(ProductAssembleCompany record);

    ProductAssembleCompany selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(ProductAssembleCompany record);

    int updateByPrimaryKey(ProductAssembleCompany record);

    int deleteByProductId(@Param("id") Long id,@Param("list") List<Long> assembleCompanyIds);

    int batchInsert(List<ProductAssembleCompany> records);

    List<Long> selectCompanyIdsByProductId(Long productId);

    List<ProductAssembleCompany> selectByProductId(Long productId);

    List<Long> selectCompanyIdsByProductIdOK(Long productId);

    int updateProductAssembleCompany(@Param("pid") Long pid,@Param("uid") Long uid ,@Param("cid")Long cid);

    List<Long> selectGatheredCompanyIdsByProductId(@Param("productId") Long productId,@Param("companyId") Long companyId);

    ProductAssembleCompany selectByProductIdAndCompanyId(@Param("productId") Long productId, @Param("companyId") Long companyId);

    int updateLinkByProductAndCompany(ProductAssembleCompany vo);
}