package com.jdy.b2b.api.controller;

import com.github.pagehelper.PageHelper;
import com.jdy.b2b.api.common.BaseController;
import com.jdy.b2b.api.common.JSONUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.reports.BuyerCountDO;
import com.jdy.b2b.api.model.reports.BuyerCountQueryDTO;
import com.jdy.b2b.api.service.BuyerCountService;
import com.jdy.b2b.api.vo.BuyerCountQueryVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by yangcheng on 2017/9/11.
 */
@RestController
@RequestMapping("buyerCount")
public class BuyerCountController extends BaseController {
    @Autowired
    private BuyerCountService buyerCountService;
    /**
     * 查列表
     *
     */
    @PostMapping("list")
    public ResultBean<Map<String,Object>> buyerCountReportsList(@RequestBody BuyerCountQueryVo vo){
        if (vo.getCurrPage() != null && vo.getPageSize() != null) {
            PageHelper.startPage(vo.getCurrPage(), vo.getPageSize());
        }
        BuyerCountQueryDTO dto = JSONUtil.trans(vo, BuyerCountQueryDTO.class);
        //查询列表信息
        List<BuyerCountDO> list = buyerCountService.buyerCountReportsList(dto);
        //查询统计信息
        BuyerCountDO countResult = buyerCountService.queryAllBuyerCount(dto);
        Map map = new HashMap<>();
        map.put("list",list);
        map.put("count",countResult);
        return ResultBean.getSuccessResult(map);

    }


}
