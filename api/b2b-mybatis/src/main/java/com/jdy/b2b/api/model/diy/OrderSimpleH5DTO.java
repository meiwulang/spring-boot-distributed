package com.jdy.b2b.api.model.diy;

import java.math.BigDecimal;
import java.util.Objects;

/**
 * Created by strict on 2017/10/13.
 */
public class OrderSimpleH5DTO {
    private Long o_product_id;
    private String o_product_name;
    private String o_product_num;
    private Integer o_days;
    private String o_start_date;
    private String o_end_date;
    private BigDecimal total_fee;
    private Long o_id;
    private String o_number;
    private String u_wx_openid;
    private Integer o_status;
    private Integer contract_template_num;
    private BigDecimal o_un_pay;
    private BigDecimal o_first_pay;
    private Integer o_source;
    private BigDecimal o_to_pay;//礼品卡：待支付
    private Integer o_type;
    private Integer o_pay_method;
    private Integer offline_status;//0-待确认 1-驳回 2-已确认 3-二次支付待确认 4-二次支付驳回 5-二次支付已确认
    private Integer show_type;//0-线下和微信 1-线下 2-微信 -1=都不显示

    public BigDecimal getO_un_pay() {
        return o_un_pay;
    }

    public void setO_un_pay(BigDecimal o_un_pay) {
        this.o_un_pay = o_un_pay;
    }

    public BigDecimal getO_first_pay() {
        return o_first_pay;
    }

    public void setO_first_pay(BigDecimal o_first_pay) {
        this.o_first_pay = o_first_pay;
    }

    public Integer getO_source() {
        return o_source;
    }

    public void setO_source(Integer o_source) {
        this.o_source = o_source;
    }

    public String getU_wx_openid() {
        return u_wx_openid;
    }

    public void setU_wx_openid(String u_wx_openid) {
        this.u_wx_openid = u_wx_openid;
    }

    public Long getO_product_id() {
        return o_product_id;
    }

    public void setO_product_id(Long o_product_id) {
        this.o_product_id = o_product_id;
    }

    public String getO_product_name() {
        return o_product_name;
    }

    public void setO_product_name(String o_product_name) {
        this.o_product_name = o_product_name;
    }

    public String getO_product_num() {
        return o_product_num;
    }

    public void setO_product_num(String o_product_num) {
        this.o_product_num = o_product_num;
    }

    public Integer getO_days() {
        return o_days;
    }

    public void setO_days(Integer o_days) {
        this.o_days = o_days;
    }

    public String getO_start_date() {
        return o_start_date;
    }

    public void setO_start_date(String o_start_date) {
        this.o_start_date = o_start_date;
    }

    public String getO_end_date() {
        return o_end_date;
    }

    public void setO_end_date(String o_end_date) {
        this.o_end_date = o_end_date;
    }

    public BigDecimal getTotal_fee() {
        if(o_source == 4){
            if(o_status == 3){
                return o_un_pay;
            }else{
                return o_first_pay;
            }
        } else if(o_source == 3) {
            return o_to_pay;
        }
        return total_fee;
    }

    public void setTotal_fee(BigDecimal total_fee) {
        this.total_fee = total_fee;
    }

    public Long getO_id() {
        return o_id;
    }

    public void setO_id(Long o_id) {
        this.o_id = o_id;
    }

    public String getO_number() {
        return o_number;
    }

    public void setO_number(String o_number) {
        this.o_number = o_number;
    }

    public Integer getO_status() {
        return o_status;
    }

    public void setO_status(Integer o_status) {
        this.o_status = o_status;
    }

    public Integer getContract_template_num() {
        return contract_template_num;
    }

    public void setContract_template_num(Integer contract_template_num) {
        this.contract_template_num = contract_template_num;
    }

    public BigDecimal getO_to_pay() {
        return o_to_pay;
    }

    public void setO_to_pay(BigDecimal o_to_pay) {
        this.o_to_pay = o_to_pay;
    }

    public Integer getO_type() {
        return o_type;
    }

    public void setO_type(Integer o_type) {
        this.o_type = o_type;
    }

    public Integer getO_pay_method() {
        return o_pay_method;
    }

    public void setO_pay_method(Integer o_pay_method) {
        this.o_pay_method = o_pay_method;
    }

    public Integer getOffline_status() {
        return offline_status;
    }

    public void setOffline_status(Integer offline_status) {
        this.offline_status = offline_status;
    }

    //0-线下和微信 1-线下 2-微信 -1-都不显示
    public Integer getShow_type() {
        boolean wx = false;
        boolean off = false;
        if(o_status == 1 && (offline_status == null || Objects.equals(offline_status, 1)) ) {
            wx =true;
            off= true;
        }
        if(o_status == 3) {
            if((offline_status == null || Objects.equals(offline_status, 2) || Objects.equals(offline_status, 4)) && o_un_pay.signum() > 0) {
                off = true;
                wx = true;
            }
        }
        if(wx && off) return 0;
        if(!wx && off) return 1;
        if(wx && !off) return 2;
        return -1;
    }
}
