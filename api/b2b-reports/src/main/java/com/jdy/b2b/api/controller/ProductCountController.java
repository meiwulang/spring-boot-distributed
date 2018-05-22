package com.jdy.b2b.api.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.JSONUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.reports.ProductCountQueryDO;
import com.jdy.b2b.api.model.reports.ProductCountQueryDTO;
import com.jdy.b2b.api.service.ProductCountService;
import com.jdy.b2b.api.vo.ProductCountQueryVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by yangcheng on 2017/9/14.
 */
@RestController
@RequestMapping("productCount")
public class ProductCountController {
    @Autowired
    private ProductCountService productCountService;

    @PostMapping("list")
    public ResultBean<Map<String,Object>> queryProductCountPage(@RequestBody ProductCountQueryVo vo){
        if (vo.getCurrPage() != null && vo.getPageSize() != null) {
            PageHelper.startPage(vo.getCurrPage(), vo.getPageSize());
        }
        ProductCountQueryDTO dto = JSONUtil.trans(vo, ProductCountQueryDTO.class);
        Map<String,Object> map = new HashMap<String,Object>();
        //查询列表信息
        List<ProductCountQueryDO> list = productCountService.queryProductCountPage(dto);
        //查询统计信息
        ProductCountQueryDO count = productCountService.queryAllProductCount(dto);
        map.put("list",list);
        map.put("count",count);
        return ResultBean.getSuccessResult(map);
    }
}
