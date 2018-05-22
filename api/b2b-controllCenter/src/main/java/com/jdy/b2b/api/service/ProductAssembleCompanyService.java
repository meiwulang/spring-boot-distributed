package com.jdy.b2b.api.service;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.product.ProductAssembleCompany;

import java.util.List;

/**
 * Created by dugq on 2018/2/7.
 */
public interface ProductAssembleCompanyService {
    int deleteByPrimaryKey(Long id);

    int insert(ProductAssembleCompany record);

    int insertSelective(ProductAssembleCompany record);

    ProductAssembleCompany selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(ProductAssembleCompany record);

    int updateByPrimaryKey(ProductAssembleCompany record);

    int batchInsert(Long productId,List<Long> companyIds);

    List<Long> selectCompanyIdsByProductId(Long productId);

    int deleteByProductId( Long id, List<Long> assembleCompanyIds);

    ResultBean updateLinkByProductAndCompany(ProductAssembleCompany vo);
}
