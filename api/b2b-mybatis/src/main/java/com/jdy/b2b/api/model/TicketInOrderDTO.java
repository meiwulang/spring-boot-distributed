package com.jdy.b2b.api.model;

/**
 * Created by strict on 2018/4/16.
 */
public class TicketInOrderDTO {
    private Long ticketId;
    private String title;
    private Integer ticketType;//单票套票
    private Integer type;//成人儿童票
    private Integer num = 1;

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Integer getTicketType() {
        return ticketType;
    }

    public void setTicketType(Integer ticketType) {
        this.ticketType = ticketType;
    }

    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getNum() {
        return num;
    }

    public void setNum(Integer num) {
        this.num = num;
    }
}
