package com.jdy.b2b.web.service;

import com.jdy.b2b.web.pojo.orderRefund.OrderRefundQueryVo;
import com.jdy.b2b.web.pojo.orderRefund.OrderRefundResult;
import com.jdy.b2b.web.pojo.orderRefund.OrderRefundUpdateVo;
import com.jdy.b2b.web.util.ResultBean;

/**
 * Created by yangcheng on 2017/8/30.
 */
public interface OrderRefundService {
    ResultBean<Long> updateOrderRefund(OrderRefundUpdateVo vo);

    ResultBean<OrderRefundResult> QueryOrderRefundPage(OrderRefundQueryVo vo);
}
