package com.jdy.b2b.api.model.diy;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.jdy.b2b.api.common.constants.annotations.DateJsonSerializerNoTime;
import com.jdy.b2b.api.common.constants.annotations.DateJsonSerializerYMDHMS;

import java.math.BigDecimal;
import java.sql.Time;
import java.util.Date;

/**
 * Created by strict on 2017/9/22.
 */
public class OrderH5DTO {
    private Long order_id;
    private String o_number;
    private Integer o_num;
    private Integer o_big_num;
    private Integer o_small_num;
    private Integer o_bed_num;
    private String o_product_num;
    private String o_product_name;
    private Long o_product_id;
    private String o_product_type;
    private Integer o_days;
    @JsonSerialize(using=DateJsonSerializerYMDHMS.class)
    private Date o_sell_time;
    @JsonSerialize(using=DateJsonSerializerNoTime.class)
    private Date o_start_date;
    @JsonSerialize(using=DateJsonSerializerNoTime.class)
    private Date o_end_date;
    private Time o_start_time;
    private Date o_confirm_time;
    private String o_out_num;
    private String o_deal_num;
    private String org_name;
    private Long org_id;
    private String org_city;
    private String sorg_province;
    private String org_addr;
    private String o_pay_method;
    private String o_type;
    private String o_name;
    private String service_name;
    private String service_mob;
    private String o_vip_mob;
    private String o_vip_name;
    private BigDecimal o_buy_real;
    private BigDecimal o_settle_real;
    private BigDecimal realPay;
    private String o_status;
    private Integer orderStatus;
    private Long o_worg_id;
    private Long o_sorg_id;
    private Integer del_order;
    private Integer teamPlanList;
    private String site_go;
    private String site_back;
    private String seat_detail;
    private Integer o_sit_type;
    private String p_brokerage1;
    private String p_brokerage2;
    private String p_brokerage3;
    private Integer s_sit_type;//入座方式 0:不对号入座 1:对号入座(系统随机) 2:对号入座(人工选择)
    private String o_remark;
    private String o_contract_agreement;//合同补充约定

    private BigDecimal o_first_pay;
    private BigDecimal o_un_pay;
    private Integer existsContract;

    private Integer refundStatus;
    private Integer applyRefundFlag;

    private Integer groupDeleteStatus;
    private Integer groupStatus;

    private Long firstAgentId;//SQL中已弃用！
    private Integer isDirector;
    private Long orderBuyerId;

    private Integer orderRefundStatus;

    public Integer getOrderRefundStatus() {
        return orderRefundStatus;
    }

    public void setOrderRefundStatus(Integer orderRefundStatus) {
        this.orderRefundStatus = orderRefundStatus;
    }

    public Integer getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(Integer orderStatus) {
        this.orderStatus = orderStatus;
    }

    public BigDecimal getRealPay() {
        return realPay;
    }

    public void setRealPay(BigDecimal realPay) {
        this.realPay = realPay;
    }

    public Long getOrderBuyerId() {
        return orderBuyerId;
    }

    public void setOrderBuyerId(Long orderBuyerId) {
        this.orderBuyerId = orderBuyerId;
    }

    public Long getFirstAgentId() {
        return firstAgentId;
    }

    public void setFirstAgentId(Long firstAgentId) {
        this.firstAgentId = firstAgentId;
    }

    public Integer getIsDirector() {
        return isDirector;
    }

    public void setIsDirector(Integer isDirector) {
        this.isDirector = isDirector;
    }

    public Integer getGroupDeleteStatus() {
        return groupDeleteStatus;
    }

    public void setGroupDeleteStatus(Integer groupDeleteStatus) {
        this.groupDeleteStatus = groupDeleteStatus;
    }

    public Integer getGroupStatus() {
        return groupStatus;
    }

    public void setGroupStatus(Integer groupStatus) {
        this.groupStatus = groupStatus;
    }

    public Integer getRefundStatus() {
        return refundStatus;
    }

    public void setRefundStatus(Integer refundStatus) {
        this.refundStatus = refundStatus;
    }

    public Integer getApplyRefundFlag() {
        return applyRefundFlag;
    }

    public void setApplyRefundFlag(Integer applyRefundFlag) {
        this.applyRefundFlag = applyRefundFlag;
    }

    public Integer getExistsContract() {
        return existsContract;
    }

    public void setExistsContract(Integer existsContract) {
        this.existsContract = existsContract;
    }

    public BigDecimal getO_first_pay() {
        return o_first_pay;
    }

    public void setO_first_pay(BigDecimal o_first_pay) {
        this.o_first_pay = o_first_pay;
    }

    public BigDecimal getO_un_pay() {
        return o_un_pay;
    }

    public void setO_un_pay(BigDecimal o_un_pay) {
        this.o_un_pay = o_un_pay;
    }

    public Long getOrder_id() {
        return order_id;
    }

    public void setOrder_id(Long order_id) {
        this.order_id = order_id;
    }

    public String getO_number() {
        return o_number;
    }

    public void setO_number(String o_number) {
        this.o_number = o_number;
    }

    public Integer getO_num() {
        if (o_num != null){
            return this.o_num;
        }else{
            return this.o_big_num + this.o_small_num;
        }
    }

    public void setO_num(Integer o_num) {
        this.o_num = o_num;
    }

    public Integer getO_big_num() {
        return o_big_num;
    }

    public void setO_big_num(Integer o_big_num) {
        this.o_big_num = o_big_num;
    }

    public Integer getO_small_num() {
        return o_small_num;
    }

    public void setO_small_num(Integer o_small_num) {
        this.o_small_num = o_small_num;
    }

    public Integer getO_bed_num() {
        return o_bed_num;
    }

    public void setO_bed_num(Integer o_bed_num) {
        this.o_bed_num = o_bed_num;
    }

    public String getO_product_num() {
        return o_product_num;
    }

    public void setO_product_num(String o_product_num) {
        this.o_product_num = o_product_num;
    }

    public String getO_product_name() {
        return o_product_name;
    }

    public void setO_product_name(String o_product_name) {
        this.o_product_name = o_product_name;
    }

    public Long getO_product_id() {
        return o_product_id;
    }

    public void setO_product_id(Long o_product_id) {
        this.o_product_id = o_product_id;
    }

    public String getO_product_type() {
        return o_product_type;
    }

    public void setO_product_type(String o_product_type) {
        this.o_product_type = o_product_type;
    }

    public Integer getO_days() {
        return o_days;
    }

    public void setO_days(Integer o_days) {
        this.o_days = o_days;
    }

    public Date getO_sell_time() {
        return o_sell_time;
    }

    public void setO_sell_time(Date o_sell_time) {
        this.o_sell_time = o_sell_time;
    }

    public Date getO_start_date() {
        return o_start_date;
    }

    public void setO_start_date(Date o_start_date) {
        this.o_start_date = o_start_date;
    }

    public Date getO_end_date() {
        return o_end_date;
    }

    public void setO_end_date(Date o_end_date) {
        this.o_end_date = o_end_date;
    }

    public Time getO_start_time() {
        return o_start_time;
    }

    public void setO_start_time(Time o_start_time) {
        this.o_start_time = o_start_time;
    }

    public Date getO_confirm_time() {
        return o_confirm_time;
    }

    public void setO_confirm_time(Date o_confirm_time) {
        this.o_confirm_time = o_confirm_time;
    }

    public String getO_out_num() {
        return o_out_num;
    }

    public void setO_out_num(String o_out_num) {
        this.o_out_num = o_out_num;
    }

    public String getO_deal_num() {
        return o_deal_num;
    }

    public void setO_deal_num(String o_deal_num) {
        this.o_deal_num = o_deal_num;
    }

    public String getOrg_name() {
        return org_name;
    }

    public void setOrg_name(String org_name) {
        this.org_name = org_name;
    }

    public Long getOrg_id() {
        return org_id;
    }

    public void setOrg_id(Long org_id) {
        this.org_id = org_id;
    }

    public String getOrg_city() {
        return org_city;
    }

    public void setOrg_city(String org_city) {
        this.org_city = org_city;
    }

    public String getSorg_province() {
        return sorg_province;
    }

    public void setSorg_province(String sorg_province) {
        this.sorg_province = sorg_province;
    }

    public String getOrg_addr() {
        return org_addr;
    }

    public void setOrg_addr(String org_addr) {
        this.org_addr = org_addr;
    }

    public String getO_pay_method() {
        return o_pay_method;
    }

    public void setO_pay_method(String o_pay_method) {
        this.o_pay_method = o_pay_method;
    }

    public String getO_type() {
        return o_type;
    }

    public void setO_type(String o_type) {
        this.o_type = o_type;
    }

    public String getO_name() {
        return o_name;
    }

    public void setO_name(String o_name) {
        this.o_name = o_name;
    }

    public String getService_name() {
        return service_name;
    }

    public void setService_name(String service_name) {
        this.service_name = service_name;
    }

    public String getService_mob() {
        return service_mob;
    }

    public void setService_mob(String service_mob) {
        this.service_mob = service_mob;
    }

    public String getO_vip_mob() {
        return o_vip_mob;
    }

    public void setO_vip_mob(String o_vip_mob) {
        this.o_vip_mob = o_vip_mob;
    }

    public String getO_vip_name() {
        return o_vip_name;
    }

    public void setO_vip_name(String o_vip_name) {
        this.o_vip_name = o_vip_name;
    }

    public BigDecimal getO_buy_real() {
        return o_buy_real;
    }

    public void setO_buy_real(BigDecimal o_buy_real) {
        this.o_buy_real = o_buy_real;
    }

    public BigDecimal getO_settle_real() {
        return o_settle_real;
    }

    public void setO_settle_real(BigDecimal o_settle_real) {
        this.o_settle_real = o_settle_real;
    }

    public String getO_status() {
        return o_status;
    }

    public void setO_status(String o_status) {
        this.o_status = o_status;
    }

    public Long getO_worg_id() {
        return o_worg_id;
    }

    public void setO_worg_id(Long o_worg_id) {
        this.o_worg_id = o_worg_id;
    }

    public Long getO_sorg_id() {
        return o_sorg_id;
    }

    public void setO_sorg_id(Long o_sorg_id) {
        this.o_sorg_id = o_sorg_id;
    }

    public Integer getDel_order() {
        return del_order;
    }

    public void setDel_order(Integer del_order) {
        this.del_order = del_order;
    }

    public Integer getTeamPlanList() {
        return teamPlanList;
    }

    public void setTeamPlanList(Integer teamPlanList) {
        this.teamPlanList = teamPlanList;
    }

    public String getSite_go() {
        return site_go;
    }

    public void setSite_go(String site_go) {
        this.site_go = site_go;
    }

    public String getSite_back() {
        return site_back;
    }

    public void setSite_back(String site_back) {
        this.site_back = site_back;
    }

    public String getSeat_detail() {
        return seat_detail;
    }

    public void setSeat_detail(String seat_detail) {
        this.seat_detail = seat_detail;
    }

    public Integer getO_sit_type() {
        return o_sit_type;
    }

    public void setO_sit_type(Integer o_sit_type) {
        this.o_sit_type = o_sit_type;
    }

    public String getP_brokerage1() {
        return p_brokerage1;
    }

    public void setP_brokerage1(String p_brokerage1) {
        this.p_brokerage1 = p_brokerage1;
    }

    public String getP_brokerage2() {
        return p_brokerage2;
    }

    public void setP_brokerage2(String p_brokerage2) {
        this.p_brokerage2 = p_brokerage2;
    }

    public String getP_brokerage3() {
        return p_brokerage3;
    }

    public void setP_brokerage3(String p_brokerage3) {
        this.p_brokerage3 = p_brokerage3;
    }

    public Integer getS_sit_type() {
        return s_sit_type;
    }

    public void setS_sit_type(Integer s_sit_type) {
        this.s_sit_type = s_sit_type;
    }

    public String getO_remark() {
        return o_remark;
    }

    public void setO_remark(String o_remark) {
        this.o_remark = o_remark;
    }

    public String getO_contract_agreement() {
        return o_contract_agreement;
    }

    public void setO_contract_agreement(String o_contract_agreement) {
        this.o_contract_agreement = o_contract_agreement;
    }
}
