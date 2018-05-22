package com.jdy.b2b.web.controll.reports;

import com.alibaba.fastjson.JSONObject;
import com.jdy.b2b.web.annotation.NoLogin;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;


/**
 * Created by Darker on 2018/01/20.
 */
@Controller
@RequestMapping("orderSync")
public class OrderSyncController extends BaseController{

    @ResponseBody
    @RequestMapping("save")
    public ResultBean queryDaysOfOrderAmount(@RequestBody JSONObject params) {
        String url = reportsCenterUrl + "orderSync/save";
        return restTemplate.postForEntity(url, params, ResultBean.class).getBody();
    }
}
