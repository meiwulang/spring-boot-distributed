package com.jdy.b2b.api.controller;

import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.CostingTitleDTO;
import com.jdy.b2b.api.model.ProductCosting;
import com.jdy.b2b.api.model.ProductCostingQueryDTO;
import com.jdy.b2b.api.model.ProductCostingTitle;
import com.jdy.b2b.api.model.QueryCostByProductAndDateVO;
import com.jdy.b2b.api.service.ProductCostingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * Created by zhangfofa on 2018/2/6.
 */
@Controller
@RequestMapping("productCosting")
public class ProductCostingController {

    @Autowired
    private ProductCostingService productCostingService;

    @RequestMapping("/addProductCosting")
    @ResponseBody
    public ResultBean addProductCosting(@RequestBody ProductCosting productCosting) {
        return productCostingService.addProductCosting(productCosting,productCosting.getScheduleSettingId());
    }

    @RequestMapping("/queryProductCostingTitleListById")
    @ResponseBody
    public ResultBean queryProductCostingTitleListById(@RequestBody ProductCostingQueryDTO productCostingQueryDTO) {
        List<Map> mapList = productCostingService.queryProductCostingTitleListById(productCostingQueryDTO);
        PageInfo pageInfo = new PageInfo(mapList);
        return ResultBean.getSuccessResult(pageInfo);
    }

    /*班期核算成本列表*/
    @RequestMapping("/queryCostingTitleList")
    @ResponseBody
    public ResultBean queryCostingTitleList(@RequestBody CostingTitleDTO dto) {
        List<Map> mapList = productCostingService.queryCostingTitleList(dto);
        PageInfo pageInfo = new PageInfo(mapList);
        return ResultBean.getSuccessResult(pageInfo);
    }

    @RequestMapping("/queryProductCostingAllInformationById")
    @ResponseBody
    public ResultBean queryProductCostingAllInformationById(@RequestBody ProductCostingQueryDTO productCostingQueryDTO) {
        return productCostingService.queryProductCostingAllInformationById(productCostingQueryDTO);
    }

    /**
     * 审核成本
     * @param vo
     * @return
     */
    @PostMapping("/modifyProductCostingTitle")
    @ResponseBody
    public ResultBean modifyProductCostingTitle(@RequestBody ProductCostingTitle vo){
        return  productCostingService.modifyProductCostingTitle(vo);
    }

    @GetMapping("/selectNewestCostUnitPriceByProductId/{productId}")
    @ResponseBody
    public ResultBean selectNewestCostUnitPriceByProductId(@PathVariable Long productId){
        BigDecimal bigDecimal = productCostingService.selectNewestCostUnitPriceByProductId(productId);
        return ResultBean.getSuccessResult(bigDecimal);
    }
    @PostMapping("/selectNewestCostUnitPriceByProductIdAndDate")
    @ResponseBody
    public ResultBean selectNewestCostUnitPriceByProductIdAndDate(@RequestBody QueryCostByProductAndDateVO vo){
        BigDecimal bigDecimal = productCostingService.selectNewestCostUnitPriceByProductIdAndDate(vo.getProductId(),vo.getDate());
        return ResultBean.getSuccessResult(bigDecimal);
    }

}
