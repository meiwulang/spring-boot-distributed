package com.jdy.b2b.web.controll.orderRefund;

import com.jdy.b2b.web.pojo.orderRefund.OrderRefundQueryVo;
import com.jdy.b2b.web.pojo.orderRefund.OrderRefundResult;
import com.jdy.b2b.web.pojo.orderRefund.OrderRefundUpdateVo;
import com.jdy.b2b.web.service.OrderRefundService;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.JSONUtil;
import com.jdy.b2b.web.util.ResultBean;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by yangcheng on 2017/8/28.
 */
@Api(value = "order_refund", description = "线下退款")
@RestController
@RequestMapping("order_refund")
public class OrderRefundController extends BaseController{
    @Autowired
    private OrderRefundService orderRefundService;

    /**
     * 处理 标记
     * @param vo
     * @return
     */
    @ApiOperation(value = "处理/标记线下退款")
    @PostMapping("update")
    public ResultBean<Long> updateOrderRefund(@RequestBody @Validated OrderRefundUpdateVo vo){
        return orderRefundService.updateOrderRefund(vo);
    }

    /**
     * 查询列表
     * @param vo
     * @return
     */
    @ApiOperation(value = "线下退款列表")
    @PostMapping("list")
    public ResultBean<OrderRefundResult> QueryOrderRefundPage(@RequestBody @Validated OrderRefundQueryVo vo){
        return orderRefundService.QueryOrderRefundPage(vo);
    }

}
