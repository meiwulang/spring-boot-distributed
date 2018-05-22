package com.jdy.b2b.api.dao;

import com.jdy.b2b.api.model.productStatistics.ListParam;
import com.jdy.b2b.api.model.productStatistics.Order4Statistics;
import com.jdy.b2b.api.model.productStatistics.ProductOrder;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * Created by dugq on 2017/11/16.
 */
@Mapper
public interface ProductStatisticsMapper {
    List<ProductOrder> selectProductList(ListParam param);
    List<Order4Statistics> selectOrderList(ListParam param);
}
