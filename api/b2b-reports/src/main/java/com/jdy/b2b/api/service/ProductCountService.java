package com.jdy.b2b.api.service;

import com.jdy.b2b.api.model.reports.ProductCountQueryDO;
import com.jdy.b2b.api.model.reports.ProductCountQueryDTO;

import java.util.List;

/**
 * Created by yangcheng on 2017/9/14.
 */
public interface ProductCountService {
    List<ProductCountQueryDO> queryProductCountPage(ProductCountQueryDTO trans);

    ProductCountQueryDO queryAllProductCount(ProductCountQueryDTO dto);
}
