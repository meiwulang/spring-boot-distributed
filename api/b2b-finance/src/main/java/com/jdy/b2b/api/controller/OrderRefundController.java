package com.jdy.b2b.api.controller;

import com.github.pagehelper.PageHelper;
import com.jdy.b2b.api.common.BaseController;
import com.jdy.b2b.api.common.Constants;
import com.jdy.b2b.api.common.JSONUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.orderRefund.OrderRefund;
import com.jdy.b2b.api.model.orderRefund.OrderRefundResult;
import com.jdy.b2b.api.service.OrderRefundService;
import com.jdy.b2b.api.model.orderRefund.OrderRefundQueryDTO;
import com.jdy.b2b.api.vo.orderRefund.OrderRefundQueryVo;
import com.jdy.b2b.api.vo.orderRefund.OrderRefundUpdateVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Objects;

/**
 * Created by yangcheng on 2017/8/29.
 */
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
    @PostMapping("update")
    public ResultBean<Long> updateOrderRefund(@RequestBody OrderRefundUpdateVo vo){
        OrderRefund orderRefund = JSONUtil.trans(vo, OrderRefund.class);

        if(!(Objects.isNull(orderRefund.getId()))){
            //执行修改
            orderRefund.setUpdateTime(new Date());
            orderRefund.setUpdateUser(vo.getPuserId());
            int result = orderRefundService.updateOrderRefund(orderRefund);
            if(result>0){
                return ResultBean.getSuccessResult((long)result);
            }else{
                //return new ResultBean<Long>("-1","修改退款记录失败!");
                throw new RuntimeException("修改退款记录失败!");
            }
        }else{
            //return new ResultBean<Long>("-1","修改退款记录不可传递id!");
            throw new RuntimeException("修改退款记录不可传递id!");
        }
    }

    /**
     * 查询线下退款列表 关联查询标签信息(名称 颜色)
     * @param vo
     * @return
     */
    @PostMapping("list")
    public ResultBean<OrderRefundResult> QueryOrderRefundPage(@RequestBody OrderRefundQueryVo vo){
        if (vo.getCurrPage() != null && vo.getPageSize() != null) {
            PageHelper.startPage(vo.getCurrPage(), vo.getPageSize());
        }
        OrderRefundQueryDTO dto = JSONUtil.trans(vo, OrderRefundQueryDTO.class);
        OrderRefundResult result = orderRefundService.QueryOrderRefundPage(dto);

        return ResultBean.getSuccessResult(result);

    }

}
