package com.jdy.b2b.api.model.diy;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * Created by strict on 2017/9/29.
 */
public class TicketDetailH5DTO {

    private Long t_product_id;  //产品 id
    private Long t_id;       //票 id
    private String t_standards_name;
    private String t_preset_type;
    private BigDecimal t_price;
    private BigDecimal t_trade_price;
    private Integer t_store;
    private String t_limit_type;
    private String t_limit_condition;
    private String t_groups;
    private BigDecimal t_spread_price;
    private BigDecimal t_out_room_price;
    private Integer num;
    private Integer room_num;
    private List<TicketDetailH5DTO> childList;
    private Map<String,TicketDetailH5DTO> list;

    public Long getT_product_id() {
        return t_product_id;
    }

    public void setT_product_id(Long t_product_id) {
        this.t_product_id = t_product_id;
    }

    public Long getT_id() {
        return t_id;
    }

    public void setT_id(Long t_id) {
        this.t_id = t_id;
    }

    public String getT_standards_name() {
        return t_standards_name;
    }

    public void setT_standards_name(String t_standards_name) {
        this.t_standards_name = t_standards_name;
    }

    public String getT_preset_type() {
        return t_preset_type;
    }

    public void setT_preset_type(String t_preset_type) {
        this.t_preset_type = t_preset_type;
    }

    public BigDecimal getT_price() {
        return t_price;
    }

    public void setT_price(BigDecimal t_price) {
        this.t_price = t_price;
    }

    public BigDecimal getT_trade_price() {
        return t_trade_price;
    }

    public void setT_trade_price(BigDecimal t_trade_price) {
        this.t_trade_price = t_trade_price;
    }

    public Integer getT_store() {
        return t_store;
    }

    public void setT_store(Integer t_store) {
        this.t_store = t_store;
    }

    public String getT_limit_type() {
        return t_limit_type;
    }

    public void setT_limit_type(String t_limit_type) {
        this.t_limit_type = t_limit_type;
    }

    public String getT_limit_condition() {
        return t_limit_condition;
    }

    public void setT_limit_condition(String t_limit_condition) {
        this.t_limit_condition = t_limit_condition;
    }

    public String getT_groups() {
        return t_groups;
    }

    public void setT_groups(String t_groups) {
        this.t_groups = t_groups;
    }

    public BigDecimal getT_spread_price() {
        return t_spread_price;
    }

    public void setT_spread_price(BigDecimal t_spread_price) {
        this.t_spread_price = t_spread_price;
    }

    public BigDecimal getT_out_room_price() {
        return t_out_room_price;
    }

    public void setT_out_room_price(BigDecimal t_out_room_price) {
        this.t_out_room_price = t_out_room_price;
    }

    public Integer getNum() {
        return num;
    }

    public void setNum(Integer num) {
        this.num = num;
    }

    public Integer getRoom_num() {
        return room_num;
    }

    public void setRoom_num(Integer room_num) {
        this.room_num = room_num;
    }

    public List<TicketDetailH5DTO> getChildList() {
        return childList;
    }

    public void setChildList(List<TicketDetailH5DTO> childList) {
        this.childList = childList;
    }

    public Map<String, TicketDetailH5DTO> getList() {
        return list;
    }

    public void setList(Map<String, TicketDetailH5DTO> list) {
        this.list = list;
    }
}
