package com.jdy.b2b.api.controller;

import com.github.pagehelper.PageHelper;
import com.jdy.b2b.api.common.JSONUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.reports.OnlinePayQueryDTO;
import com.jdy.b2b.api.service.OnlinePayService;
import com.jdy.b2b.api.vo.OnlinePayQueryVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by yangcheng on 2017/9/14.
 */
@RestController
@RequestMapping("onlinePay")
public class OnlinePayController {
    @Autowired
    private OnlinePayService onlinePayService;

    @PostMapping("list")
    public ResultBean<Map<String,Object>> queryOnlinePayPage(@RequestBody OnlinePayQueryVo vo){
        return null;
    }
}
