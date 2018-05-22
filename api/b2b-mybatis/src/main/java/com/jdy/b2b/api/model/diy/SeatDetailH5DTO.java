package com.jdy.b2b.api.model.diy;

import java.math.BigDecimal;
import java.sql.Time;

/**
 * Created by strict on 2017/9/26.
 */
public class SeatDetailH5DTO {

    /****
     *
     * "s_vip_name":"徐姐",
     "s_vip_mob":"15356650555",
     "s_vip_card_type":"身份证",
     "s_vip_card":"1111",
     "s_vip_age":"30岁",
     "s_tname":"成人汽车",
     "s_tfname":"亲子套票",
     "s_ticket_type":"成人票",
     "s_start_sttime":"9:00",
     "s_start_stname":"海陵区三水湾西大门停车场（北）",
     "s_start_price":"20.00",
     "s_end_sttime":"18:00",
     "s_end_stname":"海陵区三水湾西大门停车场（北）"
     "s_end_price"
     *
     *
     */


    private String s_vip_name;
    private String s_vip_mob;
    private String s_vip_card_type;
    private String s_vip_card;
    private String s_vip_age;
    private String s_tname;
    private String s_tfname;
    private String s_ticket_type;
    private Time s_start_sttime;
    private String  s_start_stname;
    private BigDecimal s_start_price ;
    private Time s_end_sttime;
    private String s_end_stname;
    private BigDecimal  s_end_price;
    private Integer ot_rep;

    public String getS_vip_name() {
        return s_vip_name;
    }

    public void setS_vip_name(String s_vip_name) {
        this.s_vip_name = s_vip_name;
    }

    public String getS_vip_mob() {
        return s_vip_mob;
    }

    public void setS_vip_mob(String s_vip_mob) {
        this.s_vip_mob = s_vip_mob;
    }

    public String getS_vip_card_type() {
        return s_vip_card_type;
    }

    public void setS_vip_card_type(String s_vip_card_type) {
        this.s_vip_card_type = s_vip_card_type;
    }

    public String getS_vip_card() {
        return s_vip_card;
    }

    public void setS_vip_card(String s_vip_card) {
        this.s_vip_card = s_vip_card;
    }

    public String getS_vip_age() {
        return s_vip_age;
    }

    public void setS_vip_age(String s_vip_age) {
        this.s_vip_age = s_vip_age;
    }

    public String getS_tname() {
        return s_tname;
    }

    public void setS_tname(String s_tname) {
        this.s_tname = s_tname;
    }

    public String getS_tfname() {
        return s_tfname;
    }

    public void setS_tfname(String s_tfname) {
        this.s_tfname = s_tfname;
    }

    public String getS_ticket_type() {
        return s_ticket_type;
    }

    public void setS_ticket_type(String s_ticket_type) {
        this.s_ticket_type = s_ticket_type;
    }

    public Time getS_start_sttime() {
        return s_start_sttime;
    }

    public void setS_start_sttime(Time s_start_sttime) {
        this.s_start_sttime = s_start_sttime;
    }

    public String getS_start_stname() {
        return s_start_stname;
    }

    public void setS_start_stname(String s_start_stname) {
        this.s_start_stname = s_start_stname;
    }

    public BigDecimal getS_start_price() {
        return s_start_price;
    }

    public void setS_start_price(BigDecimal s_start_price) {
        this.s_start_price = s_start_price;
    }

    public Time getS_end_sttime() {
        return s_end_sttime;
    }

    public void setS_end_sttime(Time s_end_sttime) {
        this.s_end_sttime = s_end_sttime;
    }

    public String getS_end_stname() {
        return s_end_stname;
    }

    public void setS_end_stname(String s_end_stname) {
        this.s_end_stname = s_end_stname;
    }

    public BigDecimal getS_end_price() {
        return s_end_price;
    }

    public void setS_end_price(BigDecimal s_end_price) {
        this.s_end_price = s_end_price;
    }

    public Integer getOt_rep() {
        return ot_rep;
    }

    public void setOt_rep(Integer ot_rep) {
        this.ot_rep = ot_rep;
    }
}
