package com.jdy.b2b.web.service.impl;

import com.jdy.b2b.web.pojo.productRecommend.ProductRecommendDTO;
import com.jdy.b2b.web.pojo.productRecommend.ProductRecommendQueryVo;
import com.jdy.b2b.web.service.ProductRecommendService;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.stereotype.Service;

/**
 * Created by yangcheng on 2017/8/14.
 */
@Service
public class ProductRecommendServiceImpl extends BaseService implements ProductRecommendService{

    @Override
    public ResultBean queryProductRecommendListForPage(ProductRecommendQueryVo vo) {
        StringBuffer url = new StringBuffer(controllCenterUrl).append("productRecommend/list");
        return restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
    }
}
