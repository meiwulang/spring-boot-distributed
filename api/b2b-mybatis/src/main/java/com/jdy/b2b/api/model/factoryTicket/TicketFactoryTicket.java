package com.jdy.b2b.api.model.factoryTicket;

import java.io.Serializable;

public class TicketFactoryTicket implements Serializable {
    private static final long serialVersionUID = -7381656819888327854L;
    private Long id;

    private Long ticketId;

    private Long factoryTicketId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }

    public Long getFactoryTicketId() {
        return factoryTicketId;
    }

    public void setFactoryTicketId(Long factoryTicketId) {
        this.factoryTicketId = factoryTicketId;
    }
}