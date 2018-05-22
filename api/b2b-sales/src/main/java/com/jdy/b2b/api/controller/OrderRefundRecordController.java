package com.jdy.b2b.api.controller;

import com.jdy.b2b.api.common.BaseController;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.OrderLogsMapper;
import com.jdy.b2b.api.dao.OrderMapper;
import com.jdy.b2b.api.dao.OrderPayMapper;
import com.jdy.b2b.api.dao.OrderTouristMapper;
import com.jdy.b2b.api.dao.diy.OrderMapperDiy;
import com.jdy.b2b.api.dao.product.ProductMapper;
import com.jdy.b2b.api.dto.OrderRefundRecordCloseVO;
import com.jdy.b2b.api.dto.OrderRefundRecordConfirmVO;
import com.jdy.b2b.api.model.OrderPay;
import com.jdy.b2b.api.model.orderRefund.OrderRefundsRecord;
import com.jdy.b2b.api.model.orderRefund.OrderRefundsRecordVO;
import com.jdy.b2b.api.model.orderRefund.TouristTicketDTO;
import com.jdy.b2b.api.service.OrderRefundRecordService;
import com.jdy.b2b.api.util.MQAssembleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.task.TaskExecutor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.Random;

/**
 * Created by yangcheng on 2018/2/27.
 */
@RestController
@RequestMapping("orderRefundRecord")
public class OrderRefundRecordController extends BaseController{
    @Autowired
    private OrderRefundRecordService orderRefundRecordService;
    @Autowired
    private OrderMapper orderMapper;
    @Autowired
    private OrderTouristMapper orderTouristMapper;
    @Autowired
    private OrderPayMapper orderPayMapper;
    @Autowired
    private OrderLogsMapper orderLogsMapper;
    @Autowired
    private ProductMapper productMapper;
    @Autowired
    MQAssembleService mqAssembleService;
    @Autowired
    TaskExecutor taskExecutor;
    @Autowired
    private OrderMapperDiy orderMapperDiy;
    @Value("${changsha.tuijieqianzhui2}")
    String tuijieqianzhui2;


    //关闭退款需要将该订单下最新的一条退款记录改为已关闭
    @PostMapping("closeOrderRefund")
    public ResultBean closeOrderRefund(@RequestBody OrderRefundRecordCloseVO vo){
        //查询该订单下 最大的退款记录id
        Long id  = orderRefundRecordService.selectMaxIdByOrderId(vo.getOrderId());
        //执行更新退款记录状态
        OrderRefundsRecord record = new OrderRefundsRecord();
        record.setId(id);
        record.setStatus(0);
        record.setRefundableTime(new Date());
        int result  = orderRefundRecordService.updateOrderRefund(record);

        return ResultBean.getSuccessResult(result);
    }

    @PostMapping("confirmOrderRefund")
    @Transactional
    public ResultBean confirmOrderRefund(@RequestBody OrderRefundRecordConfirmVO vo){
        return orderRefundRecordService.confirmOrderRefund(vo);
    }

    private void insertOrderPay(OrderRefundRecordConfirmVO vo) {
        OrderPay orderPay = new OrderPay();
        orderPay.setOpOrderId(vo.getOrderId());
        orderPay.setOpPayNo(getTransNo());
        orderPay.setOpPayAmount(BigDecimal.ZERO.subtract(vo.getRefundAmount()));
        orderPay.setOpPayMethod(2);
        orderPay.setOpComments("订单退款确认调用");
        orderPay.setOpOprater(vo.getpURealName());
        orderPay.setOpPayTime(new Date());
        orderPay.setoIsmerge(false);
        orderPay.setCreateTime(new Date());
        orderPay.setCreateUser(vo.getPuserId());
        orderPayMapper.insert(orderPay);
    }

    public String getTransNo() {
        String format = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        int result = new Random().nextInt(100000000);
        String num = String.format("%08d", result);
        return "TK"+format+num;
    }

    @GetMapping("getTouristListForRefund/{orderId}")
    public ResultBean getTouristListForRefund(@PathVariable("orderId") Long orderId){
        List<TouristTicketDTO> list = orderRefundRecordService.getTouristTicketList(orderId);
        return ResultBean.getSuccessResult(list);
    }

    @PostMapping("applyOrderRefund")
    public ResultBean applyOrderRefund(@RequestBody OrderRefundsRecordVO vo){

        return orderRefundRecordService.applyOrderRefund(vo);
    }

    @GetMapping("getRefundRecord/{orderId}/{flag}")
    public ResultBean getRefundRecord(@PathVariable("orderId") Long orderId,@PathVariable("flag") Integer flag){
        List<OrderRefundsRecord> list = orderRefundRecordService.getRefundRecord(orderId);
        if (flag != null && flag >0){
            return ResultBean.getSuccessResult(list.get(0));
        }
        return ResultBean.getSuccessResult(list);
    }

    @GetMapping("getOtherRefundTypeForOrder/{orderId}")
    public ResultBean getOtherRefundTypeForOrder(@PathVariable("orderId") Long orderId){
        return orderRefundRecordService.selectOtherTypeRefundRecordNum(orderId);
    }

}
