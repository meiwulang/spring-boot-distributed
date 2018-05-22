package com.jdy.b2b.api.service;

import com.jdy.b2b.api.model.designProject.DesignProduct;
import com.jdy.b2b.api.model.designProject.SearchProduct;
import com.jdy.b2b.api.model.product.Product;

import java.util.List;

/**
 * Created by dugq on 2018/1/17.
 */
public interface DesignProductService {
    int deleteByPrimaryKey(Long id);

    int insert(DesignProduct record);

    int insertSelective(DesignProduct record);

    DesignProduct selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(DesignProduct record);

    int updateByPrimaryKey(DesignProduct record);

    int save(DesignProduct designProduct);

    List<Product> selectProductsByNameAndNoInUserCompany(SearchProduct vo);
}
