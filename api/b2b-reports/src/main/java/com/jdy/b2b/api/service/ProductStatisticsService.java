package com.jdy.b2b.api.service;

import com.jdy.b2b.api.model.productStatistics.ListParam;
import com.jdy.b2b.api.model.productStatistics.Order4Statistics;
import com.jdy.b2b.api.model.productStatistics.ProductOrder;

import java.util.List;

/**
 * Created by dugq on 2017/11/16.
 */
public interface ProductStatisticsService {
    List<ProductOrder> selectProductList(ListParam param);

    List<Order4Statistics> selectOrderList(ListParam param);

    /**
     * 查询所有订单，可以把部门作为条件，查询该部门以及该部门的子部门的所有订单
     * @param param
     * @return
     */
    List<Order4Statistics> selectOrderListByDepartment(ListParam param);

    /**
     * 根据单位查询该单位以及其子单位的所有订单
     * @param param
     * @return
     */
    List<Order4Statistics> selectOrderListByCompany(ListParam param);

    /**
     * 根据一级代理人
     * @param param
     * @return
     */
    List<Order4Statistics> selectOrderListByAgent(ListParam param);


}
