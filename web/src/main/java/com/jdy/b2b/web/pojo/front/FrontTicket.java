package com.jdy.b2b.web.pojo.front;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * Created by dugq on 2017/9/19.
 */
public class FrontTicket implements Serializable {
    private static final long serialVersionUID = 6539798002765586909L;

    private Long t_id;
    private String t_preset_type;  //票类型
    private BigDecimal t_price; //门市价
    private BigDecimal t_trade_price; //同行价
    private int t_store; //库存量
    private String t_weekly;

    public Long getT_id() {
        return t_id;
    }

    public void setT_id(Long t_id) {
        this.t_id = t_id;
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

    public int getT_store() {
        return t_store;
    }

    public void setT_store(int t_store) {
        this.t_store = t_store;
    }

    public String getT_weekly() {
        return t_weekly;
    }

    public void setT_weekly(String t_weekly) {
        this.t_weekly = t_weekly;
    }
}
