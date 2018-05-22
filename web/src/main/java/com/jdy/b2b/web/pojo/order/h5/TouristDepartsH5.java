package com.jdy.b2b.web.pojo.order.h5;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.math.BigDecimal;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/9/26 20:11
 */
@ApiModel(description = "接送站点信息")
public class TouristDepartsH5 {
    @ApiModelProperty(value = "去程线路id(shuttle_bus)")
    private Long start_bus_id;
    @ApiModelProperty(value = "返程线路id(shuttle_bus)")
    private Long end_bus_id;
    @ApiModelProperty(value = "类型 0:始发站 1:顺路站 2:班车站")
    private String start_site_type;
    @ApiModelProperty(value = "去程出发地名称")
    private String start_site;
    @ApiModelProperty(value = "去程出发地id")
    private Long start_sid;
    @ApiModelProperty(value = "出发时间")
    private String start_date;
    @ApiModelProperty(value = "去程接送价格")
    private BigDecimal start_price;
    @ApiModelProperty(value = "类型 0:始发站 1:顺路站 2:班车站")
    private String end_site_type;
    @ApiModelProperty(value = "回程出发地名称")
    private String end_site;
    @ApiModelProperty(value = "回程出发地id")
    private Long end_sid;
    @ApiModelProperty(value = "回程时间")
    private String end_date;
    @ApiModelProperty(value = "回程接送价格")
    private BigDecimal end_price;
    @ApiModelProperty(value = "游客名字")
    private String vip_name;
    @ApiModelProperty(value = "游客手机")
    private String vip_mob;
    @ApiModelProperty(value = "证件类型 0:身份证 1:护照 2:军官证 3:回乡证 4:台胞证 5:国际海员证 6:港澳通行证 7:赴台证 8:其他")
    private String vip_card_type;
    @ApiModelProperty(value = "证件号")
    private String vip_card;
    @ApiModelProperty(value = "是否游客代表：0-否，1-是")
    private Integer is_rep;

    public String getStart_site_type() {
        return start_site_type;
    }

    public void setStart_site_type(String start_site_type) {
        this.start_site_type = start_site_type;
    }

    public String getStart_site() {
        return start_site;
    }

    public void setStart_site(String start_site) {
        this.start_site = start_site;
    }

    public Long getStart_sid() {
        return start_sid;
    }

    public void setStart_sid(Long start_sid) {
        this.start_sid = start_sid;
    }

    public String getStart_date() {
        return start_date;
    }

    public void setStart_date(String start_date) {
        this.start_date = start_date;
    }

    public BigDecimal getStart_price() {
        return start_price;
    }

    public void setStart_price(BigDecimal start_price) {
        this.start_price = start_price;
    }

    public String getEnd_site_type() {
        return end_site_type;
    }

    public void setEnd_site_type(String end_site_type) {
        this.end_site_type = end_site_type;
    }

    public String getEnd_site() {
        return end_site;
    }

    public void setEnd_site(String end_site) {
        this.end_site = end_site;
    }

    public Long getEnd_sid() {
        return end_sid;
    }

    public void setEnd_sid(Long end_sid) {
        this.end_sid = end_sid;
    }

    public String getEnd_date() {
        return end_date;
    }

    public void setEnd_date(String end_date) {
        this.end_date = end_date;
    }

    public BigDecimal getEnd_price() {
        return end_price;
    }

    public void setEnd_price(BigDecimal end_price) {
        this.end_price = end_price;
    }

    public String getVip_name() {
        return vip_name;
    }

    public void setVip_name(String vip_name) {
        this.vip_name = vip_name;
    }

    public String getVip_mob() {
        return vip_mob;
    }

    public void setVip_mob(String vip_mob) {
        this.vip_mob = vip_mob;
    }

    public String getVip_card_type() {
        return vip_card_type;
    }

    public void setVip_card_type(String vip_card_type) {
        this.vip_card_type = vip_card_type;
    }

    public String getVip_card() {
        return vip_card;
    }

    public void setVip_card(String vip_card) {
        this.vip_card = vip_card;
    }

    public Long getStart_bus_id() {
        return start_bus_id;
    }

    public void setStart_bus_id(Long start_bus_id) {
        this.start_bus_id = start_bus_id;
    }

    public Long getEnd_bus_id() {
        return end_bus_id;
    }

    public void setEnd_bus_id(Long end_bus_id) {
        this.end_bus_id = end_bus_id;
    }

    public Integer getIs_rep() {
        return is_rep;
    }

    public void setIs_rep(Integer is_rep) {
        this.is_rep = is_rep;
    }
}
