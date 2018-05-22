package com.jdy.b2b.api.service;

import com.jdy.b2b.api.common.Constants;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.orderRefund.OrderRefund;
import com.jdy.b2b.api.model.orderRefund.OrderRefundQueryDTO;
import com.jdy.b2b.api.model.orderRefund.OrderRefundResult;
import com.jdy.b2b.api.model.orderRefund.OrderRefundResultDO;

import java.util.List;

/**
 * Created by yangcheng on 2017/8/29.
 */
public interface OrderRefundService {
    OrderRefundResult QueryOrderRefundPage(OrderRefundQueryDTO dto);

    ResultBean<Long> saveOrderRefund(OrderRefund orderRefund);

    int updateOrderRefund(OrderRefund orderRefund);

}
