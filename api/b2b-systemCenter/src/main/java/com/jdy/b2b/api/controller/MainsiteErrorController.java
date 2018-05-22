package com.jdy.b2b.api.controller;

import com.alibaba.fastjson.JSONObject;
import com.jdy.b2b.api.common.ResultBean;
import org.springframework.boot.autoconfigure.web.ErrorController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by ASUS on 2017/8/24.
 */
@RestController
public class MainsiteErrorController implements ErrorController {

    private static final String ERROR_PATH = "/error";

    @RequestMapping(value=ERROR_PATH)
    public String handleError(){
        ResultBean resultBean = ResultBean.getErrorResult();
        return JSONObject.toJSONString(resultBean);
    }

    @Override
    public String getErrorPath() {
        // TODO Auto-generated method stub
        return ERROR_PATH;
    }
}
