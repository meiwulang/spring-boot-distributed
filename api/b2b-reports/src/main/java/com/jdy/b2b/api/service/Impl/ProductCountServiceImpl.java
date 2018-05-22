package com.jdy.b2b.api.service.Impl;

import com.jdy.b2b.api.common.BaseService;
import com.jdy.b2b.api.dao.product.ProductMapper;
import com.jdy.b2b.api.dao.reports.ProductCountMapper;
import com.jdy.b2b.api.model.reports.ProductCountQueryDO;
import com.jdy.b2b.api.model.reports.ProductCountQueryDTO;
import com.jdy.b2b.api.service.ProductCountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by yangcheng on 2017/9/14.
 */
@Service
public class ProductCountServiceImpl extends BaseService implements ProductCountService {
    @Autowired
    private ProductCountMapper productCountMapper;


    @Override
    public List<ProductCountQueryDO> queryProductCountPage(ProductCountQueryDTO trans) {
        return productCountMapper.queryProductCountPage(trans);
    }

    @Override
    public ProductCountQueryDO queryAllProductCount(ProductCountQueryDTO dto) {
        return productCountMapper.queryAllProductCount(dto);
    }
}
