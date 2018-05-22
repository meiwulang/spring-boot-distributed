package com.jdy.b2b.web.controll.product;

import com.jdy.b2b.web.pojo.product.CostingTitleDTO;
import com.jdy.b2b.web.pojo.product.ProductCosting;
import com.jdy.b2b.web.pojo.product.ProductCostingQueryDTO;
import com.jdy.b2b.web.pojo.product.ProductCostingTitle;
import com.jdy.b2b.web.pojo.product.QueryCostByProductAndDateVO;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by zhangfofa on 2018/2/6.
 */
@Controller
@RequestMapping("/productCosting")
public class ProductCostingController extends BaseController {


    @RequestMapping("/addProductCosting")
    @ResponseBody
    public ResultBean addProductCosting(@RequestBody ProductCosting productCosting) {
        String url = controllCenterUrl + "productCosting/addProductCosting";
        return restTemplate.postForEntity(url, productCosting, ResultBean.class).getBody();
    }

    @RequestMapping("/queryProductCostingTitleListById")
    @ResponseBody
    public ResultBean queryProductCostingTitleListById(@RequestBody ProductCostingQueryDTO productCostingQueryDTO) {
        String url = controllCenterUrl + "productCosting/queryProductCostingTitleListById";
        return restTemplate.postForEntity(url, productCostingQueryDTO, ResultBean.class).getBody();
    }

    /*班期核算成本列表*/
    @RequestMapping("/queryCostingTitleList")
    @ResponseBody
    public ResultBean queryCostingTitleList(@RequestBody CostingTitleDTO dto) {
        String url = controllCenterUrl + "productCosting/queryCostingTitleList";
        return restTemplate.postForEntity(url, dto, ResultBean.class).getBody();
    }

    @RequestMapping("/queryProductCostingAllInformationById")
    @ResponseBody
    public ResultBean queryProductCostingAllInformationById(@RequestBody ProductCostingQueryDTO productCostingQueryDTO) {
        String url = controllCenterUrl + "productCosting/queryProductCostingAllInformationById";
        return restTemplate.postForEntity(url, productCostingQueryDTO, ResultBean.class).getBody();
    }

    @PostMapping("/modifyProductCostingTitle")
    @ResponseBody
    public ResultBean modifyProductCostingTitle(@RequestBody ProductCostingTitle vo){
        String url = controllCenterUrl + "productCosting/modifyProductCostingTitle";
        return restTemplate.postForObject(url,vo,ResultBean.class);
    }
    @PostMapping("/selectNewestCostUnitPriceByProductIdAndDate")
    @ResponseBody
    public ResultBean selectNewestCostUnitPriceByProductIdAndDate(@RequestBody QueryCostByProductAndDateVO vo){
    	String url = controllCenterUrl + "productCosting/selectNewestCostUnitPriceByProductIdAndDate";
    	return restTemplate.postForObject(url,vo,ResultBean.class);
    }
}
