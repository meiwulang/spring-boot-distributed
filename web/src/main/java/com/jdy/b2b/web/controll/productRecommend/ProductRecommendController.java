package com.jdy.b2b.web.controll.productRecommend;

import com.jdy.b2b.web.pojo.productRecommend.ProductRecommendDTO;
import com.jdy.b2b.web.pojo.productRecommend.ProductRecommendQueryVo;
import com.jdy.b2b.web.service.ProductRecommendService;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by yangcheng on 2017/8/14.
 */
@Api(value = "productRecommend", description = "操作产品推荐")
@RestController
@RequestMapping("productRecommend")
public class ProductRecommendController extends BaseController{
    @Autowired
    private ProductRecommendService productRecommendService;

    /**
     * 查询产品推荐列表
     * @param vo
     * @return
     */
    @ApiOperation("查产品推荐列表")
    @RequestMapping(value="list",method = RequestMethod.POST)
    public ResultBean queryProductRecommendListForPage(@RequestBody @Validated ProductRecommendQueryVo vo){
        return  productRecommendService.queryProductRecommendListForPage(vo);
    }

}
