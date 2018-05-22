package com.jdy.b2b.api.model.diy;


import com.jdy.b2b.api.model.orderOffline.OrderOffline;

import java.math.BigDecimal;
import java.util.List;

/**
 * Created by dugq on 2018/1/24.
 */
public class OrderPay4H5DTO extends OrderPayLine {
    private BigDecimal money;
    private byte orderStatus;
    private byte payMethod;
    private List<OrderOffline> orderOfflineList;

    private String payMethodStr;
    private String orderStatusStr;
    private String moneyStr;

    public String getMoneyStr() {
        return moneyStr;
    }

    public void setMoneyStr(String moneyStr) {
        this.moneyStr = moneyStr;
    }

    public String getPayMethodStr() {
        return payMethodStr;
    }

    public void setPayMethodStr(String payMethodStr) {
        this.payMethodStr = payMethodStr;
    }

    public String getOrderStatusStr() {
        return orderStatusStr;
    }

    public void setOrderStatusStr(String orderStatusStr) {
        this.orderStatusStr = orderStatusStr;
    }

    public List<OrderOffline> getOrderOfflineList() {
        return orderOfflineList;
    }

    public void setOrderOfflineList(List<OrderOffline> orderOfflineList) {
        this.orderOfflineList = orderOfflineList;
    }

    public OrderPay4H5DTO() {
        super(0);
    }


    public BigDecimal getMoney() {
        return money;
    }

    public void setMoney(BigDecimal money) {
        this.money = money;
    }

    public byte getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(byte orderStatus) {
        this.orderStatus = orderStatus;
    }

    public byte getPayMethod() {
        return payMethod;
    }

    public void setPayMethod(byte payMethod) {
        this.payMethod = payMethod;
    }

}
