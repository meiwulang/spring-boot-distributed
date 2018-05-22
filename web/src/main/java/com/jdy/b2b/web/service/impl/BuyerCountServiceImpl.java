package com.jdy.b2b.web.service.impl;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.jdy.b2b.web.pojo.reports.BuyerCountQueryVo;
import com.jdy.b2b.web.service.BuyerCountService;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.ResultBean;

/**
 * Created by yangcheng on 2017/9/12.
 */
@Service
public class BuyerCountServiceImpl extends BaseService implements BuyerCountService{

    @Override
    public ResultBean<Map<String,Object>> queryBuyerCountPage(BuyerCountQueryVo vo) {
        StringBuffer url = new StringBuffer(reportsCenterUrl).append("buyerCount/list");
        return restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
    }
}
