package com.jdy.b2b.web.service.impl;

import com.jdy.b2b.web.pojo.orderRefund.OrderRefundQueryVo;
import com.jdy.b2b.web.pojo.orderRefund.OrderRefundResult;
import com.jdy.b2b.web.pojo.orderRefund.OrderRefundUpdateVo;
import com.jdy.b2b.web.service.OrderRefundService;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.stereotype.Service;

/**
 * Created by yangcheng on 2017/8/30.
 */
@Service
public class OrderRefundServiceImpl extends BaseService implements OrderRefundService {

    @Override
    public ResultBean<Long> updateOrderRefund(OrderRefundUpdateVo vo) {
        StringBuffer url = new StringBuffer(financeCenterUrl).append("order_refund/update");
        return restTemplate.postForEntity(url.toString(),vo, ResultBean.class).getBody();
    }

    @Override
    public ResultBean<OrderRefundResult> QueryOrderRefundPage(OrderRefundQueryVo vo) {
        StringBuffer url = new StringBuffer(financeCenterUrl).append("order_refund/list");
        return restTemplate.postForEntity(url.toString(),vo, ResultBean.class).getBody();
    }
}
