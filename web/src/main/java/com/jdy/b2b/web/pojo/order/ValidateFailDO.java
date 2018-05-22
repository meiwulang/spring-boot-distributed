package com.jdy.b2b.web.pojo.order;

import com.jdy.b2b.web.util.BaseVO;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/10/10 10:59
 */
public class ValidateFailDO extends BaseVO {
    private Long orderId;

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }
}
