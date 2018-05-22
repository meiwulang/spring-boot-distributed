package com.jdy.b2b.web.controll.ProductAssemble;

import com.jdy.b2b.web.pojo.productAssemble.ProductAssembleCompany;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by strict on 2018/3/20.
 */
@RestController
@RequestMapping("/productAssembleCompany")
public class ProductAssembleCompanyController extends BaseController{

    @Value("${controllCenterUrl}productAssembleCompany")
    private String MODULE_URL;

    @PostMapping("/modifyAssembleLink")
    public ResultBean modifyAssembleCompanyServicer(@RequestBody ProductAssembleCompany vo){
        return restTemplate.postForObject(MODULE_URL+"/modifyAssembleLink",vo,ResultBean.class);
    }
}
