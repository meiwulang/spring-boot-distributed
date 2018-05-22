package com.jdy.b2b.api.model.diy;

import java.math.BigDecimal;

/**
 * Created by strict on 2017/9/26.
 */
public class PayDetailH5DTO {
    /**
     * "pay_no":"PAY20176633103830",//交易单号
     "business":"订单支付",//交易说明
     "buyer_name":"王丽萍",//操作人
     "total_fee":"1080.00",//交易金额
     "pay_mode":"信用支付",//支付类型
     "pay_status":"已付款",//支付状态
     "create_time":"09:39",//操作时分
     "create_date":"06/11",//操作日期
     "remark":"差间补差了",//备注
     */

    private String pay_no;
    private String business;
    private String  buyer_name;
    private BigDecimal total_fee;
    private String  pay_mode;
    private String pay_status ;
    private String create_time;
    private String create_date ;
    private String remark;

    public String getPay_no() {
        return pay_no;
    }

    public void setPay_no(String pay_no) {
        this.pay_no = pay_no;
    }

    public String getBusiness() {
        return business;
    }

    public void setBusiness(String business) {
        this.business = business;
    }

    public String getBuyer_name() {
        return buyer_name;
    }

    public void setBuyer_name(String buyer_name) {
        this.buyer_name = buyer_name;
    }

    public BigDecimal getTotal_fee() {
        return total_fee;
    }

    public void setTotal_fee(BigDecimal total_fee) {
        this.total_fee = total_fee;
    }

    public String getPay_mode() {
        return pay_mode;
    }

    public void setPay_mode(String pay_mode) {
        this.pay_mode = pay_mode;
    }

    public String getPay_status() {
        return pay_status;
    }

    public void setPay_status(String pay_status) {
        this.pay_status = pay_status;
    }

    public String getCreate_time() {
        return create_time;
    }

    public void setCreate_time(String create_time) {
        this.create_time = create_time;
    }

    public String getCreate_date() {
        return create_date;
    }

    public void setCreate_date(String create_date) {
        this.create_date = create_date;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
}
