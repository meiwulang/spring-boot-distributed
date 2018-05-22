package com.jdy.b2b.api.controller;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.OrderSync.OrderSyncDTO;
import com.jdy.b2b.api.service.OrderSyncService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

/**
 * Created by Darker on 2018/01/20.
 */
@Controller
@RequestMapping("orderSync")
public class OrderSyncController {

    @Autowired
    OrderSyncService orderSyncService;

    @ResponseBody
    @RequestMapping("save")
    public ResultBean<Map<String, List>> save(@RequestBody OrderSyncDTO orderSyncDTO) {
        orderSyncService.save(orderSyncDTO);
        return ResultBean.getIndexSuccessResult(null);
    }
}
