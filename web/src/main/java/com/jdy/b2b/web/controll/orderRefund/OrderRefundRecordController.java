package com.jdy.b2b.web.controll.orderRefund;

import com.jdy.b2b.web.pojo.orderRefund.OrderRefundRecordCloseVO;
import com.jdy.b2b.web.pojo.orderRefund.OrderRefundRecordConfirmVO;
import com.jdy.b2b.web.pojo.orderRefund.OrderRefundsRecordVO;
import com.jdy.b2b.web.service.OrderRefundRecordService;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

/**
 * Created by yangcheng on 2017/8/28.
 */
@Api(value = "orderRefundRecord", description = "线下退款")
@RestController
@RequestMapping("orderRefundRecord")
public class OrderRefundRecordController extends BaseController{
    @Autowired
    OrderRefundRecordService orderRefundRecordService;

    /**
     * 关闭退款
     * @param vo
     * @return
     */
    @ApiOperation(value = "关闭退款")
    @PostMapping("closeOrderRefundRecord")
    public ResultBean closeOrderRefundRecord(@RequestBody OrderRefundRecordCloseVO vo){
        StringBuffer url = new StringBuffer(salesCenterUrl).append("orderRefundRecord/closeOrderRefund");
        ResultBean resultBean = restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
        if(resultBean.getParsedEnitity(Integer.class).equals(0)){
            //TODO 发送短信

        }
        return resultBean;
    }

    /**
     * 确认退款
     * 1.更改退款记录状态
     * 2.修改订单金额
     * 3.更改游客状态
     * 4.如果是全部取消的话 取消订单
     * 5.如果是首款,
     * 6.如果是尾款
     * 7.更新首款或者尾款
     * @param vo
     * @return
     */
    @ApiOperation(value = "确认退款")
    @PostMapping("confirmRefundRecord")
    public ResultBean QueryOrderRefundPage(@RequestBody OrderRefundRecordConfirmVO vo){
        if(vo.getRefundAmount()==null || vo.getRefundAmount().compareTo(BigDecimal.ZERO)<=0){
            return new ResultBean("-1","请输入一个有效的金额!");
        }
        StringBuffer url = new StringBuffer(salesCenterUrl).append("orderRefundRecord/confirmOrderRefund");
        return restTemplate.postForEntity(url.toString(),vo, ResultBean.class).getBody();
    }

    @ApiOperation(value = "退款前获取游客列表")
    @GetMapping("/getTouristListForRefund/{orderId}")
    public ResultBean getTouristListForRefund(@PathVariable("orderId") Long orderId){
        return orderRefundRecordService.getTouristListForRefund(orderId);
    }

    @ApiOperation(value = "获取订单的退款记录")
    @GetMapping("getRefundRecord/{orderId}/{flag}")
    public ResultBean getRefundRecord(@PathVariable("orderId") Long orderId,@PathVariable("flag") Integer flag){
        return orderRefundRecordService.getRefundRecord(orderId,flag);
    }

    @ApiOperation(value = "申请退款")
    @PostMapping("applyOrderRefund")
    public ResultBean applyOrderRefund(@RequestBody OrderRefundsRecordVO vo){
        return orderRefundRecordService.applyOrderRefund(vo);
    }

    @GetMapping("getOtherRefundTypeForOrder/{orderId}")
    public ResultBean selectOtherTypeRefundRecordNum(@PathVariable("orderId") Long orderId){
        return orderRefundRecordService.selectOtherTypeRefundRecordNum(orderId);
    }



}
