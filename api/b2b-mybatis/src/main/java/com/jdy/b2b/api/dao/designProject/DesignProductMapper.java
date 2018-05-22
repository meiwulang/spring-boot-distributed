package com.jdy.b2b.api.dao.designProject;

import com.jdy.b2b.api.model.designProject.DesignProduct;
import com.jdy.b2b.api.model.designProject.SearchProduct;
import com.jdy.b2b.api.model.product.Product;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
@Mapper
public interface DesignProductMapper {
    int deleteByPrimaryKey(Long id);

    int insert(DesignProduct record);

    int insertSelective(DesignProduct record);

    DesignProduct selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(DesignProduct record);

    int updateByPrimaryKey(DesignProduct record);

    DesignProduct selectByDesignId(Long designId);

    List<Product> selectProductsByNameAndNoInUserCompany(SearchProduct vo);
}