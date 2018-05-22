package com.jdy.b2b.api.model.diy;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jdy.b2b.api.common.DateTime;
import com.jdy.b2b.api.model.electroniccontract.ProductContractTemplate;

import java.math.BigDecimal;
import java.sql.Time;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by strict on 2017/9/28.
 */
public class OrderInfoH5DTO {

    private String bl_name;
    private Long p_id;
    private Integer p_days;
    private String p_num;
    private String p_name;
    private Integer p_type;
    private String p_type_name;
    private Long bl_id;
    private String bl_num;
    private String bussiness;
    private Long bussiness_id;
    private List<String> start_place;
    @JsonFormat(pattern = "yyyy-MM-dd",timezone = "GMT+8")
    private Date bl_start_date;
    private Time bl_start_time;
    private String bl_right_seat;
    private Map<String,TicketDetailH5DTO> ticket;
    private List<TicketDetailH5DTO> ticketList;
    private Integer is_cluster;
    private Boolean appoint;
    private Integer seat_num;
    @JsonFormat(pattern = "yyyy-MM-dd",timezone = "GMT+8")
    private Date bl_end_date;
    private String linkman;
    private String man_qq;
    private String meet_tel;
    private Long org_id;
    private String start_date_y;
    private String start_date_m;
    private String start_date_d;
    private String end_date_y;
    private String end_date_m;
    private String end_date_d;

    private String city_name;

    private Integer pay_way;
    private Integer firstpay_type;
    private BigDecimal pay_amount;
    private Integer  uStype;//用户类型：用于判断礼品卡的显示

    private String linkTel;
    private String salerName;
    private Integer signContract;


    /***********  页面上暂时用不到的属性   ********/
    private List<Object> p_key = new ArrayList<>();
    private List<Object> p_promotion = new ArrayList<>();
    private List<Object> vip_mob = new ArrayList<>();
    private String p_sname;


    private String bl_count = "";
    private String bl_seat_count = "";
    private String bl_saled = "";
    private List<Integer> bl_bus = new ArrayList<>();
    private Integer num;
    private Integer sell_status;
    private String t_price;
    private String t_trade_price;
    private String bl_start_week;

    private ProductContractTemplate contractTemplate;

    public String getLinkTel() {
        return linkTel;
    }

    public void setLinkTel(String linkTel) {
        this.linkTel = linkTel;
    }

    public String getSalerName() {
        return salerName;
    }

    public void setSalerName(String salerName) {
        this.salerName = salerName;
    }

    public Integer getSignContract() {
        return signContract;
    }

    public void setSignContract(Integer signContract) {
        this.signContract = signContract;
    }

    public Integer getPay_way() {
        return pay_way;
    }

    public void setPay_way(Integer pay_way) {
        this.pay_way = pay_way;
    }

    public BigDecimal getPay_amount() {

        if (pay_way == 1){
            if (this.pay_amount == null){
                return BigDecimal.ZERO;
            }
            if(firstpay_type == 2) {//首付款类型 1:固定金额(每人) 2:百分比(订单总额)
                this.pay_amount = this.pay_amount.divide(new BigDecimal(100));
            }
        }else if (pay_way == 0){
            this.pay_amount = BigDecimal.ONE;
        }
        return pay_amount;
    }

    public void setPay_amount(BigDecimal pay_amount) {
        this.pay_amount = pay_amount;
    }

    public String getP_type_name() {
        return p_type_name;
    }

    public void setP_type_name(String p_type_name) {
        this.p_type_name = p_type_name;
    }

    public String getBl_name() {
        return bl_name;
    }

    public void setBl_name(String bl_name) {
        this.bl_name = bl_name;
    }

    public Long getP_id() {
        return p_id;
    }

    public void setP_id(Long p_id) {
        this.p_id = p_id;
    }

    public Integer getP_days() {
        return p_days;
    }

    public void setP_days(Integer p_days) {
        this.p_days = p_days;
    }

    public String getP_num() {
        return p_num;
    }

    public void setP_num(String p_num) {
        this.p_num = p_num;
    }

    public String getP_name() {
        return p_name;
    }

    public void setP_name(String p_name) {
        this.p_name = p_name;
    }

    public Integer getP_type() {
        return p_type;
    }

    public void setP_type(Integer p_type) {
        this.p_type = p_type;
    }

    public Long getBl_id() {
        return bl_id;
    }

    public void setBl_id(Long bl_id) {
        this.bl_id = bl_id;
    }

    public String getBl_num() {
        return bl_num;
    }

    public void setBl_num(String bl_num) {
        this.bl_num = bl_num;
    }

    public String getBussiness() {
        return bussiness;
    }

    public void setBussiness(String bussiness) {
        this.bussiness = bussiness;
    }

    public Long getBussiness_id() {
        return bussiness_id;
    }

    public void setBussiness_id(Long bussiness_id) {
        this.bussiness_id = bussiness_id;
    }

    public List<String> getStart_place() {
        return start_place;
    }

    public void setStart_place(List<String> start_place) {
        this.start_place = start_place;
    }

    public Date getBl_start_date() {
        return bl_start_date;
    }

    public void setBl_start_date(Date bl_start_date) {
        this.bl_start_date = bl_start_date;
    }

    public Time getBl_start_time() {
        return bl_start_time;
    }

    public void setBl_start_time(Time bl_start_time) {
        this.bl_start_time = bl_start_time;
    }

    public String getBl_right_seat() {
        return bl_right_seat;
    }

    public void setBl_right_seat(String bl_right_seat) {
        this.bl_right_seat = bl_right_seat;
    }

    public Map<String, TicketDetailH5DTO> getTicket() {
        return ticket;
    }

    public void setTicket(Map<String, TicketDetailH5DTO> ticket) {
        this.ticket = ticket;
    }

    public Integer getIs_cluster() {
        return is_cluster;
    }

    public void setIs_cluster(Integer is_cluster) {
        this.is_cluster = is_cluster;
    }

    public Boolean getAppoint() {
        return appoint;
    }

    public void setAppoint(Boolean appoint) {
        this.appoint = appoint;
    }

    public Integer getSeat_num() {
        return seat_num;
    }

    public void setSeat_num(Integer seat_num) {
        this.seat_num = seat_num;
    }

    public Date getBl_end_date() {
        return bl_end_date;
    }

    public void setBl_end_date(Date bl_end_date) {
        this.bl_end_date = bl_end_date;
    }

    public String getLinkman() {
        return linkman;
    }

    public void setLinkman(String linkman) {
        this.linkman = linkman;
    }

    public String getMan_qq() {
        return man_qq;
    }

    public void setMan_qq(String man_qq) {
        this.man_qq = man_qq;
    }

    public String getMeet_tel() {
        return meet_tel;
    }

    public void setMeet_tel(String meet_tel) {
        this.meet_tel = meet_tel;
    }

    public Long getOrg_id() {
        return org_id;
    }

    public void setOrg_id(Long org_id) {
        this.org_id = org_id;
    }

    public String getStart_date_y() {

        return DateTime.date2Str(bl_start_date,"yyyy");
    }

    public void setStart_date_y(String start_date_y) {
        this.start_date_y = start_date_y;
    }

    public String getStart_date_m() {
        return DateTime.date2Str(bl_start_date,"MM");
    }

    public void setStart_date_m(String start_date_m) {
        this.start_date_m = start_date_m;
    }

    public String getStart_date_d() {
        return DateTime.date2Str(bl_start_date,"dd");
    }

    public void setStart_date_d(String start_date_d) {
        this.start_date_d = start_date_d;
    }

    public String getEnd_date_y() {
        return DateTime.date2Str(bl_end_date,"yyyy");
    }

    public void setEnd_date_y(String end_date_y) {
        this.end_date_y = end_date_y;
    }

    public String getEnd_date_m() {
        return DateTime.date2Str(bl_end_date,"MM");
    }

    public void setEnd_date_m(String end_date_m) {
        this.end_date_m = end_date_m;
    }

    public String getEnd_date_d() {
        return DateTime.date2Str(bl_end_date,"dd");
    }

    public void setEnd_date_d(String end_date_d) {
        this.end_date_d = end_date_d;
    }

    public String getCity_name() {
        return city_name;
    }

    public void setCity_name(String city_name) {
        this.city_name = city_name;
    }

    public List<Object> getP_key() {
        return p_key;
    }

    public void setP_key(List<Object> p_key) {
        this.p_key = p_key;
    }

    public List<Object> getP_promotion() {
        return p_promotion;
    }

    public void setP_promotion(List<Object> p_promotion) {
        this.p_promotion = p_promotion;
    }

    public List<Object> getVip_mob() {
        return vip_mob;
    }

    public void setVip_mob(List<Object> vip_mob) {
        this.vip_mob = vip_mob;
    }

    public String getP_sname() {
        return p_sname;
    }

    public void setP_sname(String p_sname) {
        this.p_sname = p_sname;
    }

    public String getBl_count() {
        return bl_count;
    }

    public void setBl_count(String bl_count) {
        this.bl_count = bl_count;
    }

    public String getBl_seat_count() {
        return bl_seat_count;
    }

    public void setBl_seat_count(String bl_seat_count) {
        this.bl_seat_count = bl_seat_count;
    }

    public String getBl_saled() {
        return bl_saled;
    }

    public void setBl_saled(String bl_saled) {
        this.bl_saled = bl_saled;
    }

    public List<Integer> getBl_bus() {
        return bl_bus;
    }

    public void setBl_bus(List<Integer> bl_bus) {
        this.bl_bus = bl_bus;
    }

    public Integer getNum() {
        return num;
    }

    public void setNum(Integer num) {
        this.num = num;
    }

    public Integer getSell_status() {
        return sell_status;
    }

    public void setSell_status(Integer sell_status) {
        this.sell_status = sell_status;
    }

    public String getT_price() {
        return t_price;
    }

    public void setT_price(String t_price) {
        this.t_price = t_price;
    }

    public String getT_trade_price() {
        return t_trade_price;
    }

    public void setT_trade_price(String t_trade_price) {
        this.t_trade_price = t_trade_price;
    }

    public String getBl_start_week() {
        return bl_start_week;
    }

    public void setBl_start_week(String bl_start_week) {
        this.bl_start_week = bl_start_week;
    }

    public List<TicketDetailH5DTO> getTicketList() {
        return ticketList;
    }

    public void setTicketList(List<TicketDetailH5DTO> ticketList) {
        this.ticketList = ticketList;
    }

    public ProductContractTemplate getContractTemplate() {
        return contractTemplate;
    }

    public void setContractTemplate(ProductContractTemplate contractTemplate) {
        this.contractTemplate = contractTemplate;
    }

    public Integer getuStype() {
        return uStype;
    }

    public void setuStype(Integer uStype) {
        this.uStype = uStype;
    }

    public Integer getFirstpay_type() {
        return firstpay_type;
    }

    public void setFirstpay_type(Integer firstpay_type) {
        this.firstpay_type = firstpay_type;
    }
}
