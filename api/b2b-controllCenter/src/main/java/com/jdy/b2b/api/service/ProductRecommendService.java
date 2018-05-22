package com.jdy.b2b.api.service;

import com.jdy.b2b.api.model.product.ProductRecommendDTO;
import com.jdy.b2b.api.model.product.ProductRecommendQueryVo;

import java.util.List;

/**
 * Created by yangcheng on 2017/8/14.
 */
public interface ProductRecommendService {
    List<ProductRecommendDTO> queryProductRecommendListForPage(ProductRecommendQueryVo vo);
}
