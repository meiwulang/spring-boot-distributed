package com.jdy.b2b.web.controll.order;

import com.jdy.b2b.web.pojo.order.h5.OrderH5Vo;
import com.jdy.b2b.web.pojo.order.h5.OrderUpdateContractAgreementDO;
import com.jdy.b2b.web.service.frontService.FrontOrderService;
import com.jdy.b2b.web.util.ResultBean;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * Created by strict on 2017/10/9.
 */
@RestController
@RequestMapping("front/order/m")
public class FrontOrderController {

    @Autowired
    private FrontOrderService frontOrderService;

    @PostMapping("queryOrderInfo")
    public ResultBean queryOrderInfo(@RequestBody OrderH5Vo orderH5Vo){
        return frontOrderService.queryOrderInfoForH5(orderH5Vo);
    }

    @ApiOperation("订单详情")
    @PostMapping("queryOrderDetail")
    public ResultBean queryOrderDetail(@RequestBody OrderH5Vo orderH5Vo){
        return frontOrderService.queryOrderDetailForH5(orderH5Vo);
    }
    @PostMapping("queryOrderList")
    public ResultBean queryOrderList(@RequestBody OrderH5Vo orderH5Vo){
        return frontOrderService.queryOrderListForH5(orderH5Vo);
    }
    @PostMapping("searchOrderList")
    public ResultBean searchOrderList(@RequestBody OrderH5Vo orderH5Vo){
        return frontOrderService.searchOrderListForH5(orderH5Vo);
    }
    @GetMapping("confirmOrderInfo")
    public ResultBean comfirmOrderInfo(@RequestParam("no") String no){
        return frontOrderService.confirmOrderInfo(no);
    }

    @PostMapping("/updateContractAgreement")
    public ResultBean updateContractAgreement(@RequestBody OrderUpdateContractAgreementDO order) {
        return frontOrderService.updateContractAgreement(order);
    }

}
