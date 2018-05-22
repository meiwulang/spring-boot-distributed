package com.jdy.b2b.web.service;

import com.jdy.b2b.web.pojo.productRecommend.ProductRecommendDTO;
import com.jdy.b2b.web.pojo.productRecommend.ProductRecommendQueryVo;
import com.jdy.b2b.web.util.ResultBean;

/**
 * Created by yangcheng on 2017/8/14.
 */
public interface ProductRecommendService{
    ResultBean<ProductRecommendDTO> queryProductRecommendListForPage(ProductRecommendQueryVo vo);

}
