package com.jdy.b2b.api.controller;

import com.jdy.b2b.api.common.BaseController;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dto.PageInfoExt;
import com.jdy.b2b.api.model.Order;
import com.jdy.b2b.api.model.OrderTourist;
import com.jdy.b2b.api.model.OrderTouristForBatch;
import com.jdy.b2b.api.model.PayNeedInfo;
import com.jdy.b2b.api.model.diy.OrderSearchVo;
import com.jdy.b2b.api.model.diy.OrderStaticsVO;
import com.jdy.b2b.api.model.diy.OrderStatusNumberDTO;
import com.jdy.b2b.api.model.orderOffline.OrderOffline;
import com.jdy.b2b.api.model.orderRefund.ContractOrder;
import com.jdy.b2b.api.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.github.pagehelper.PageHelper.orderBy;
import static com.github.pagehelper.PageHelper.startPage;
import static com.jdy.b2b.api.common.ResultBean.getSuccessResult;
import static com.jdy.b2b.api.enums.OrderStatusEnum.*;
import static java.util.Objects.nonNull;
import static org.apache.commons.lang3.time.DateUtils.addMilliseconds;
import static org.apache.commons.lang3.time.DateUtils.ceiling;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/8/29 16:21
 */
@RestController
@SuppressWarnings({"unchecked","rawtypes"})
@RequestMapping("Order")
public class OrderController extends BaseController {

    @Autowired
    OrderService orderService;

    /*订单列表（包括精确搜索）*/
    @PostMapping("/searchOrders")
    public ResultBean searchOrders(@RequestBody OrderSearchVo vo) {
        Date dateEnd = vo.getDateEnd();
        if(dateEnd !=null){
        	vo.setDateEnd(addMilliseconds(ceiling(dateEnd, 5), -1));
        }
        return orderService.searchOrders(vo, false);
    }

    @PostMapping("/searchContractOrders")
    public ResultBean searchContractOrders(@Validated @RequestBody OrderSearchVo vo) {
        vo.setDateEnd(addMilliseconds(ceiling(vo.getDateEnd(), 5), -1));
        ResultBean resultBean = orderService.searchOrders(vo, true);
        Object body = resultBean.getBody();
        if (body instanceof PageInfoExt) {
            PageInfoExt pageInfoExt = (PageInfoExt) body;
            Object extObj = pageInfoExt.getExtObj();
            if (extObj instanceof List) {
                Map<String, Integer> map = new HashMap<>();
                map.put("pass", 0);
                map.put("unPass", 0);
                map.put("review", 0);
                List<OrderStatusNumberDTO> list = (List<OrderStatusNumberDTO>) extObj;
                list.forEach(t -> {
                    if (TO_CONFIRM.equals(t.getStatus())) {//待确认的
                        map.put("review", t.getNumber());
                    } else if (CANCEL.equals(t.getStatus())) {//取消的过滤掉
                        return;
                    } else if (REJECT.equals(t.getStatus())) {//驳回的
                        map.put("unPass", t.getNumber());
                    } else {//其他都是通过的
                        int pass = map.get("pass");
                        int num = t.getNumber() + pass;
                        map.put("pass", num);
                    }
                });
                pageInfoExt.setExtObj(map);
            }
        }
        return resultBean;
    }

    /*订单详情*/
    @PostMapping("/detail")
    public ResultBean orderDetail(@RequestBody Order order) {
        return getSuccessResult(orderService.getOrderDetail(order));
    }

    /*组团社确认单，出团通知书*/
    @PostMapping("/groupConfirmationForm")
    public ResultBean groupConfirmationForm(@RequestBody Order order) {
        return getSuccessResult(orderService.groupConfirmationForm(order));
    }

    /*支付记录*/
    @PostMapping("/orderPayRecords")
    public ResultBean orderPayRecords(@RequestBody Order order) {
        return getSuccessResult(orderService.orderPayRecords(order));
    }

    /*计划详情*/
    @PostMapping("/planDetails")
    public ResultBean planDetails(@RequestBody Order order) {
        return getSuccessResult(orderService.planDetails(order));
    }

    /*操作日志*/
    @PostMapping("/operLogs")
    public ResultBean operLogs(@RequestBody Order order) {
        if (nonNull(order.getCurrPage()) && nonNull(order.getPageSize())) {
            startPage(order.getCurrPage(), order.getPageSize());
        }
        orderBy("g.id desc");
        return getSuccessResult(orderService.operLogs(order));
    }

    /*近期订单信息*/
    @PostMapping("/recentOrderInfo")
    public ResultBean recentOrderInfo(@RequestBody OrderStaticsVO vo) {
        vo.setDateEnd(addMilliseconds(ceiling(vo.getDateEnd(), 5), -1));
        return getSuccessResult(orderService.recentOrderInfo(vo));
    }

    /*根据订单编号查订单信息*/
    @PostMapping("/selectOrderByOrderNo")
    public ResultBean selectOrderByOrderNo(@RequestBody Order vo) {
        return getSuccessResult(orderService.selectOrderByOrderNo(vo.getoOrderNo()));
    }

    /*根据订单id查订单约定信息*/
    @GetMapping("/selectContract/{orderId}")
    public ResultBean selectContract(@PathVariable("orderId") Integer orderId) {
        ContractOrder orderContract = orderService.selectContractByOrderId(orderId);
        return getSuccessResult(orderContract);
    }

    @RequestMapping("/queryPayNeedInfoByOrderNo")
    @ResponseBody
    public ResultBean queryPayNeedInfoByOrderNo(@RequestBody String orderNo) {
        PayNeedInfo payNeedInfo = orderService.queryPayNeedInfoByOrderNo(orderNo);
        return ResultBean.getIndexSuccessResult(payNeedInfo);
    }

    @GetMapping("/getTourists")
    public ResultBean<Object> getTourists(@RequestParam Long orderId ,@RequestParam("pageNo") int pageNo,@RequestParam("pageSize") int pageSize) {
    	return ResultBean.getSuccessResult(orderService.getTourists(orderId,pageNo,pageSize));
    }
    @PostMapping("/saveTourist")
    public ResultBean<Object> saveTourist(@RequestBody OrderTourist touristInfo){
    	return orderService.saveTourist(touristInfo);
    }
    @PostMapping("/batchSaveTourist")
    public ResultBean batchSaveTourist(@RequestBody OrderTouristForBatch vo){
        return orderService.batchSaveTourist(vo);
    }
    @PostMapping("/reviewVoucher")
    public ResultBean reviewVoucher(@RequestBody List<OrderOffline> orderOffline) {
    	return orderService.reviewVoucher(orderOffline);
    }
    @PostMapping("/getVouchers")
    public ResultBean getVouchers(@RequestBody OrderOffline orderOffline) {
    	return orderService.getVouchers(orderOffline);
    }
    @GetMapping("/exportCancelTourists")
    public ResultBean<Object> exportCancelTourists(@RequestParam("scheduleId")Long scheduleId ) {
    	return orderService.exportCancelTourists(scheduleId);
    }
    @GetMapping("/getNeedToDealCount")
    public ResultBean<Object> getNeedToDealCount() {
    	return orderService.getNeedToDealCount();
    }
}
