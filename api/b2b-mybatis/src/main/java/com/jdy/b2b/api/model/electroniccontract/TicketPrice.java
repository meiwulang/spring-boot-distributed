package com.jdy.b2b.api.model.electroniccontract;

import java.math.BigDecimal;

/**
 * Created by zhangfofa on 2017/12/17.
 */
public class TicketPrice {

    private Integer ticketType;

    private BigDecimal ticketPrice;

    public Integer getTicketType() {
        return ticketType;
    }

    public void setTicketType(Integer ticketType) {
        this.ticketType = ticketType;
    }

    public BigDecimal getTicketPrice() {
        return ticketPrice;
    }

    public void setTicketPrice(BigDecimal ticketPrice) {
        this.ticketPrice = ticketPrice;
    }
}
