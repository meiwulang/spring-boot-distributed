package com.jdy.b2b.api.controller;

import com.jdy.b2b.api.common.BaseController;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.designProject.DesignProduct;
import com.jdy.b2b.api.model.designProject.SearchProduct;
import com.jdy.b2b.api.model.product.Product;
import com.jdy.b2b.api.service.DesignProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created by dugq on 2018/1/17.
 */
@RequestMapping("designProduct")
@RestController
public class DesignProductController extends BaseController {
    @Autowired
    DesignProductService designProductService;


    @RequestMapping("save")
    public ResultBean save(@RequestBody DesignProduct designProduct){
        int result = designProductService.save(designProduct);
        if(result>0){
            return ResultBean.getSuccessResult();
        }else{
            return new ResultBean("-1","请刷新产品重试");
        }
    }

    @RequestMapping("searchProduct")
    public ResultBean searchProduct(@RequestBody SearchProduct vo){
        List<Product> list = designProductService.selectProductsByNameAndNoInUserCompany(vo);
        return ResultBean.getSuccessResult(list);
    }

}
