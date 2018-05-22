package com.jdy.b2b.web.service.impl;

import com.jdy.b2b.web.pojo.reports.ProductCountQueryVo;
import com.jdy.b2b.web.service.ProductCountService;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Created by yangcheng on 2017/9/14.
 */
@Service
public class ProductCountServiceImpl extends BaseService implements ProductCountService {

    @Override
    public ResultBean<Map<String, Object>> queryProductCountPage(ProductCountQueryVo vo) {
        StringBuffer url = new StringBuffer(reportsCenterUrl).append("productCount/list");
        return restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
    }
}
