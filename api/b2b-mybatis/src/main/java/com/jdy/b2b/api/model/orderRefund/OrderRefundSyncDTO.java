package com.jdy.b2b.api.model.orderRefund;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/**
 *
 * 退款记录 同步到 分销商城的 DTO
 * Created by strict on 2018/3/13.
 */
public class OrderRefundSyncDTO {
    private String order_no;
    private BigDecimal amount;
    private String remark;
    private Integer returnFlag;
    private Long last_updated_by;
    private Date last_updated_date;
    private String channelCode;
    private String productDesc;
    private List<TouristSyncDTO> orderTourist;

    public String getOrder_no() {
        return order_no;
    }

    public void setOrder_no(String order_no) {
        this.order_no = order_no;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public Integer getReturnFlag() {
        return returnFlag;
    }

    public void setReturnFlag(Integer returnFlag) {
        this.returnFlag = returnFlag;
    }

    public Long getLast_updated_by() {
        return last_updated_by;
    }

    public void setLast_updated_by(Long last_updated_by) {
        this.last_updated_by = last_updated_by;
    }

    public Date getLast_updated_date() {
        return last_updated_date;
    }

    public void setLast_updated_date(Date last_updated_date) {
        this.last_updated_date = last_updated_date;
    }

    public String getChannelCode() {
        return channelCode;
    }

    public void setChannelCode(String channelCode) {
        this.channelCode = channelCode;
    }

    public String getProductDesc() {
        return productDesc;
    }

    public void setProductDesc(String productDesc) {
        this.productDesc = productDesc;
    }

    public List<TouristSyncDTO> getOrderTourist() {
        return orderTourist;
    }

    public void setOrderTourist(List<TouristSyncDTO> orderTourist) {
        this.orderTourist = orderTourist;
    }
}
