package com.jdy.b2b.web.service.impl;

import com.jdy.b2b.web.pojo.productStatistic.ListParam;
import com.jdy.b2b.web.service.ProductStatisticsService;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

/**
 * Created by dugq on 2017/11/16.
 */
@Service
public class ProductStatisticsServiceImpl extends BaseService implements ProductStatisticsService {

    private String listUrl;
    private String detailListUrl;

    @PostConstruct
   public void init(){
        listUrl = reportsCenterUrl + "productStatistics/list";
        detailListUrl = reportsCenterUrl + "productStatistics/detailList";
   }

    @Override
    public ResultBean selectProductList(ListParam param) {
        return restTemplate.postForEntity(listUrl,param, ResultBean.class).getBody();
    }



}
