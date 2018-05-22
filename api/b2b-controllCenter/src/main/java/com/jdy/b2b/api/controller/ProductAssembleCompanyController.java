package com.jdy.b2b.api.controller;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.product.ProductAssembleCompany;
import com.jdy.b2b.api.service.ProductAssembleCompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by strict on 2018/3/20.
 */
@RestController
@RequestMapping("/productAssembleCompany")
public class ProductAssembleCompanyController {

    @Autowired
    private ProductAssembleCompanyService productAssembleCompanyService;

    @PostMapping("/modifyAssembleLink")
    public ResultBean modifyAssembleCompanyServicer(@RequestBody ProductAssembleCompany vo){
        ResultBean resultBean = productAssembleCompanyService.updateLinkByProductAndCompany(vo);
        return resultBean;
    }
}
