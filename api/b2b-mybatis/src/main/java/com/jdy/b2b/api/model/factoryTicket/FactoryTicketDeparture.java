package com.jdy.b2b.api.model.factoryTicket;

import java.io.Serializable;
import java.util.Date;

public class FactoryTicketDeparture implements Serializable {
    private static final long serialVersionUID = -3693111132155792215L;
    private Long id;

    private Long factoryTicketId;

    private Long departureId;

    private Date createTime;

    private Long createUser;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFactoryTicketId() {
        return factoryTicketId;
    }

    public void setFactoryTicketId(Long factoryTicketId) {
        this.factoryTicketId = factoryTicketId;
    }

    public Long getDepartureId() {
        return departureId;
    }

    public void setDepartureId(Long departure) {
        this.departureId = departure;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Long getCreateUser() {
        return createUser;
    }

    public void setCreateUser(Long createUser) {
        this.createUser = createUser;
    }
}