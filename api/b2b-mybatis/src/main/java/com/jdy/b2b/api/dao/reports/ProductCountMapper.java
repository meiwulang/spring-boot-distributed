package com.jdy.b2b.api.dao.reports;

import com.jdy.b2b.api.model.reports.ProductCountQueryDO;
import com.jdy.b2b.api.model.reports.ProductCountQueryDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * Created by yangcheng on 2017/9/14.
 */
@Mapper
public interface ProductCountMapper {
    List<ProductCountQueryDO> queryProductCountPage(ProductCountQueryDTO trans);

    ProductCountQueryDO queryAllProductCount(ProductCountQueryDTO dto);
}
