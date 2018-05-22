package com.jdy.b2b.web.pojo.alterTicket;

import java.math.BigDecimal;

public class OrderAlterTicketTouristRecord {
    private Long id;

    private Long alterTicketId;

    private Long touristId;

    private String touristName;

    private String touristLincese;

    private Long ticketId;

    private String ticketName;

    private BigDecimal oldPrice;

    private BigDecimal nowPrice;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAlterTicketId() {
        return alterTicketId;
    }

    public void setAlterTicketId(Long alterTicketId) {
        this.alterTicketId = alterTicketId;
    }

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
        this.touristName = touristName == null ? null : touristName.trim();
    }

    public String getTouristLincese() {
        return touristLincese;
    }

    public void setTouristLincese(String touristLincese) {
        this.touristLincese = touristLincese == null ? null : touristLincese.trim();
    }

    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }

    public String getTicketName() {
        return ticketName;
    }

    public void setTicketName(String ticketName) {
        this.ticketName = ticketName == null ? null : ticketName.trim();
    }

    public BigDecimal getOldPrice() {
        return oldPrice;
    }

    public void setOldPrice(BigDecimal oldPrice) {
        this.oldPrice = oldPrice;
    }

    public BigDecimal getNowPrice() {
        return nowPrice;
    }

    public void setNowPrice(BigDecimal nowPrice) {
        this.nowPrice = nowPrice;
    }
}