package com.jdy.b2b.api.model.alterTicket;

import java.math.BigDecimal;

/**
 * 游客的票改签前后票价变化的dto
 * Created by strict on 2018/5/3.
 */
public class OrderAlterTicketPriceChangeDTO {

    private Long touristId;//游客表id
    private String touristName;
    private String lincese; //证件号
    private BigDecimal oldPrice;//order_price_detail表中当时下单时票价
    private BigDecimal newPrice;//现票价
    private String ticketName;

    public Long getTouristId() {
        return touristId;
    }

    public void setTouristId(Long touristId) {
        this.touristId = touristId;
    }

    public String getTouristName() {
        return touristName;
    }

    public void setTouristName(String touristName) {
        this.touristName = touristName;
    }

    public String getLincese() {
        return lincese;
    }

    public void setLincese(String lincese) {
        this.lincese = lincese;
    }

    public BigDecimal getOldPrice() {
        return oldPrice;
    }

    public void setOldPrice(BigDecimal oldPrice) {
        this.oldPrice = oldPrice;
    }

    public BigDecimal getNewPrice() {
        return newPrice;
    }

    public void setNewPrice(BigDecimal newPrice) {
        this.newPrice = newPrice;
    }

    public String getTicketName() {
        return ticketName;
    }

    public void setTicketName(String ticketName) {
        this.ticketName = ticketName;
    }
}
