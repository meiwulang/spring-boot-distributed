package com.jdy.b2b.api.model.orderRefund;

/**
 * Created by yangcheng on 2017/8/29.
 */
public class OrderRefundQueryDTO{
    private String orOrderNo;
    private Integer opPayMethod;
    private Boolean orStauts;
    //暂时用不到
    private Long orLabelId;
    private Long orBuyerId;
    private Long orSalerId;

    public Boolean getOrStauts() {
        return orStauts;
    }

    public void setOrStauts(Boolean orStauts) {
        this.orStauts = orStauts;
    }

    public Long getOrBuyerId() {
        return orBuyerId;
    }

    public void setOrBuyerId(Long orBuyerId) {
        this.orBuyerId = orBuyerId;
    }

    public Long getOrSalerId() {
        return orSalerId;
    }

    public void setOrSalerId(Long orSalerId) {
        this.orSalerId = orSalerId;
    }

    public Long getOrLabelId() {
        return orLabelId;
    }

    public void setOrLabelId(Long orLabelId) {
        this.orLabelId = orLabelId;
    }

    public String getOrOrderNo() {
        return orOrderNo;
    }

    public void setOrOrderNo(String orOrderNo) {
        this.orOrderNo = orOrderNo;
    }

    public Integer getOpPayMethod() {
        return opPayMethod;
    }

    public void setOpPayMethod(Integer opPayMethod) {
        this.opPayMethod = opPayMethod;
    }

}
