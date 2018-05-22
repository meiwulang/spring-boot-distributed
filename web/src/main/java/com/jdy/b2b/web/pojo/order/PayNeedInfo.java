package com.jdy.b2b.web.pojo.order;

import java.math.BigDecimal;
import java.util.List;

/**
 * Created by zhangfofa on 2017/12/27.
 */
public class PayNeedInfo {

    private Long orderId;

    private Integer orderSource;

    private Integer orderStatus;

    private BigDecimal toPay;

    private BigDecimal firstPay;

    private BigDecimal secondPay;

    private BigDecimal realPay;

    private Long productId;

    private List<OrderCard> orderCardList;

    private String openId;

    private Integer oType;

    private Integer payMethod;

    private Integer offlineStatus;

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Integer getOrderSource() {
        return orderSource;
    }

    public void setOrderSource(Integer orderSource) {
        this.orderSource = orderSource;
    }

    public Integer getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(Integer orderStatus) {
        this.orderStatus = orderStatus;
    }

    public BigDecimal getToPay() {
        return toPay;
    }

    public void setToPay(BigDecimal toPay) {
        this.toPay = toPay;
    }

    public BigDecimal getFirstPay() {
        return firstPay;
    }

    public void setFirstPay(BigDecimal firstPay) {
        this.firstPay = firstPay;
    }

    public BigDecimal getSecondPay() {
        return secondPay;
    }

    public void setSecondPay(BigDecimal secondPay) {
        this.secondPay = secondPay;
    }

    public BigDecimal getRealPay() {
        return realPay;
    }

    public void setRealPay(BigDecimal realPay) {
        this.realPay = realPay;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public List<OrderCard> getOrderCardList() {
        return orderCardList;
    }

    public void setOrderCardList(List<OrderCard> orderCardList) {
        this.orderCardList = orderCardList;
    }

    public String getOpenId() {
        return openId;
    }

    public void setOpenId(String openId) {
        this.openId = openId;
    }

    public Integer getoType() {
        return oType;
    }

    public void setoType(Integer oType) {
        this.oType = oType;
    }

    public Integer getPayMethod() {
        return payMethod;
    }

    public void setPayMethod(Integer payMethod) {
        this.payMethod = payMethod;
    }

    public Integer getOfflineStatus() {
        return offlineStatus;
    }

    public void setOfflineStatus(Integer offlineStatus) {
        this.offlineStatus = offlineStatus;
    }

    @Override
    public String toString() {
        return "PayNeedInfo{" +
                "orderId=" + orderId +
                ", orderSource=" + orderSource +
                ", orderStatus=" + orderStatus +
                ", toPay=" + toPay +
                ", firstPay=" + firstPay +
                ", secondPay=" + secondPay +
                ", realPay=" + realPay +
                ", productId=" + productId +
                ", orderCardList=" + orderCardList +
                ", openId=" + openId +
                '}';
    }
}
