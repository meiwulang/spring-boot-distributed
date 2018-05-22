package com.jdy.b2b.api.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.Constants;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.service.ProductRecommendService;
import com.jdy.b2b.api.model.product.ProductRecommendDTO;
import com.jdy.b2b.api.model.product.ProductRecommendQueryVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created by yangcheng on 2017/8/14.
 */

@RestController
@RequestMapping("productRecommend")
public class ProductRecommendController {

    @Autowired
    private ProductRecommendService productRecommendService;

    /**
     * 查产品推荐列表
     * @param vo
     * @return
     */
    @RequestMapping("list")
    public ResultBean queryProductRecommendListForPage(@RequestBody ProductRecommendQueryVo vo){
        if (vo.getCurrPage() != null && vo.getPageSize() != null) {
            PageHelper.startPage(vo.getCurrPage(), vo.getPageSize());
        }
        List<ProductRecommendDTO> list = productRecommendService.queryProductRecommendListForPage(vo);
        return ResultBean.getSuccessResult(new PageInfo(list));
    }
}
