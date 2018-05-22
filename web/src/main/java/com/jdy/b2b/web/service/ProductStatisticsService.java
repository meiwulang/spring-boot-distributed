package com.jdy.b2b.web.service;

import com.jdy.b2b.web.pojo.productStatistic.ListParam;
import com.jdy.b2b.web.util.ResultBean;

/**
 * Created by dugq on 2017/11/16.
 */
public interface ProductStatisticsService {
    ResultBean selectProductList(ListParam param);
}
