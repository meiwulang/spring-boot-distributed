package com.jdy.b2b.api.model.reports;

import java.math.BigDecimal;

/**
 * Created by yangcheng on 2017/9/11.
 */
public class PayMethodQueryDO {
    private String cGroup;
    private BigDecimal totalPrice;
    private Integer orderCounts;
    private Integer flag;

    public String getcGroup() {
        return cGroup;
    }

    public void setcGroup(String cGroup) {
        this.cGroup = cGroup;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public Integer getOrderCounts() {
        return orderCounts;
    }

    public void setOrderCounts(Integer orderCounts) {
        this.orderCounts = orderCounts;
    }

    public Integer getFlag() {
        return flag;
    }

    public void setFlag(Integer flag) {
        this.flag = flag;
    }
}
