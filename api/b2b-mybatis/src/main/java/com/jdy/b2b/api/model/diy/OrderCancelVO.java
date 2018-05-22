package com.jdy.b2b.api.model.diy;

import com.jdy.b2b.api.common.BaseVO;

import java.math.BigDecimal;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/9/23 14:32
 */
public class OrderCancelVO extends BaseVO {
    private Boolean isSaler;
    private Long orderId;
    private String oOrderNo;
    private BigDecimal money;
    private String remark;

    public Boolean getSaler() {
        return isSaler;
    }

    public void setSaler(Boolean saler) {
        isSaler = saler;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public BigDecimal getMoney() {
        return money;
    }

    public void setMoney(BigDecimal money) {
        this.money = money;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getoOrderNo() {
        return oOrderNo;
    }

    public void setoOrderNo(String oOrderNo) {
        this.oOrderNo = oOrderNo;
    }
}
