package com.jdy.b2b.api.model.diy;

import com.jdy.b2b.api.model.OrderTourist;

import java.math.BigDecimal;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/10/24 14:19
 */
public class OrderTouristAddVO extends OrderTourist {

    private Long subTicketId;

    private BigDecimal opPrice;

    public Long getSubTicketId() {
        return subTicketId;
    }

    public void setSubTicketId(Long subTicketId) {
        this.subTicketId = subTicketId;
    }

    public BigDecimal getOpPrice() {
        return opPrice;
    }

    public void setOpPrice(BigDecimal opPrice) {
        this.opPrice = opPrice;
    }
}
