package com.jdy.b2b.api.service.impl;

import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.aop.SetUserIdToThreadLocalAOP;
import com.jdy.b2b.api.common.*;
import com.jdy.b2b.api.dao.orderRefund.OrderRefundMapper;
import com.jdy.b2b.api.model.orderRefund.OrderRefund;
import com.jdy.b2b.api.model.orderRefund.OrderRefundResult;
import com.jdy.b2b.api.model.orderRefund.OrderRefundResultDO;
import com.jdy.b2b.api.service.OrderRefundService;
import com.jdy.b2b.api.model.orderRefund.OrderRefundQueryDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.validation.Valid;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by yangcheng on 2017/8/29.
 */
@Service
public class OrderRefundServiceImpl extends BaseService implements OrderRefundService{
    @Autowired
    private OrderRefundMapper orderRefundMapper;
    @Autowired
    private SetUserIdToThreadLocalAOP aop;

    @Override
    public OrderRefundResult QueryOrderRefundPage(OrderRefundQueryDTO dto) {
        SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd");
        //查询分页数据,注意数据权限
        List<OrderRefundResultDO> list =  orderRefundMapper.queryOrderRefundListForPage(dto);
        list.stream().forEach(r->{
            String dateStr = format.format(r.getoLeaveDay());
            r.setLeaveDayStr(dateStr);
            r.setoLeaveDay(null);
        });
        //查询统计数据,注意数据权限
        OrderRefundResult result = new OrderRefundResult();
        List<OrderRefundResult> countList = orderRefundMapper.queryOrderRefundStatus(dto);
        for(OrderRefundResult c:countList){
            if(c.getFlag().equals("all")){
                result.setCountNum(c.getCountNum());
                result.setCountRefund(c.getCountRefund());
            }else if(c.getFlag().equals("now")){
                result.setCountNumNow(c.getCountNum());
                result.setCountRefundNow(c.getCountRefund());
            }
        }
        result.setPageInfo(new PageInfo<OrderRefundResultDO>(list));
        return result;
    }


    /**
     * 撤销订单或者订单优惠时  新增线下退款
     * @param orderRefund
     * @return
     */
    @Override
    public ResultBean<Long> saveOrderRefund(OrderRefund orderRefund) {
        int result = orderRefundMapper.insert(orderRefund);
        if(result>0){
            return ResultBean.getSuccessResult(orderRefund.getId());
        }else{
            return new ResultBean<Long>("-1","插入0条记录,保存线下退款失败");
        }
    }

    @Override
    public int updateOrderRefund(OrderRefund orderRefund) {
        return orderRefundMapper.updateByPrimaryKeySelective(orderRefund);
    }
}
