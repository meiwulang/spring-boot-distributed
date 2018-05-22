package com.jdy.b2b.api.controller.fingercrm;

import com.alibaba.fastjson.JSON;
import com.jdy.b2b.api.common.BaseController;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.fingercrm.ProductSyncInfoDTO;
import com.jdy.b2b.api.model.fingercrm.ProductSyncSimpleVo;
import com.jdy.b2b.api.model.fingercrm.ProductSyncVO;
import com.jdy.b2b.api.model.fingercrm.ProductTicketSyncInfoDTO;
import com.jdy.b2b.api.service.fingercrm.ProductSyncService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by strict on 2017/10/10.
 */
@RestController
@RequestMapping("fingercrm/product")
public class ProductSynController extends BaseController{
    @Autowired
    private ProductSyncService productSyncService;

    /**
     * 由分销端拉去需要发布的票
     * @return
     */
    @PostMapping("synchro")
    public Object sycnProductList(@RequestBody ProductSyncSimpleVo productSyncVO){
        List<ProductTicketSyncInfoDTO> list = productSyncService.getProductList(productSyncVO);
        Map<String,Object> res = new HashMap<>();
        res.put("products",list);
        return ResultBean.getSuccessResult(res);
    }

    /**
     * 由礼品卡拉去需要绑定的票
     * @return
     */
    @GetMapping("synchroToPresent")
    public Object sycnToPresentProductList(){
        List<ProductSyncInfoDTO> list = productSyncService.getToPresentProductList();
        return ResultBean.getSuccessResult(list);
    }


    /**
     * 由分销端同步过来每张票的同步情况
     *
     * @param productSyncVO
     * @return
     */
    @PostMapping("status/synchro")
    public Object syncProduct(@RequestBody ProductSyncVO productSyncVO){
        logger.info("发布产品 ==================> " + JSON.toJSONString(productSyncVO));
        return productSyncService.syncProduct(productSyncVO);
    }

}
