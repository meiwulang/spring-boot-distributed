package com.jdy.b2b.api.model.factoryTicket;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;

public class FactoryTicket implements Serializable {

    private static final long serialVersionUID = -721338489817955792L;
    private Long id;

    private Long productId;

    private Byte type;

    private String ticketName;

    @DateTimeFormat(pattern="yyyy-MM-dd")
    @JsonFormat(pattern="yyyy-MM-dd")
    private LocalDate suitableStartTime;

    @DateTimeFormat(pattern="yyyy-MM-dd")
    @JsonFormat(pattern="yyyy-MM-dd")
    private LocalDate suitableEndTime;

    private BigDecimal price;

    private String introduction;

    private Byte ticketStatus;

    private Date createTime;

    private Long createUser;

    private List<Long> departureIds;

    private List<String> departureNames;

    private Integer pageIndex;

    private BigDecimal costPrice;


    public List<String> getDepartureNames() {
        return departureNames;
    }

    public void setDepartureNames(List<String> departureNames) {
        this.departureNames = departureNames;
    }

    public BigDecimal getCostPrice() {
        return costPrice;
    }

    public void setCostPrice(BigDecimal costPrice) {
        this.costPrice = costPrice;
    }

    public Integer getPageIndex() {
        return pageIndex;
    }

    public void setPageIndex(Integer pageIndex) {
        this.pageIndex = pageIndex;
    }

    public List<Long> getDepartureIds() {
        return departureIds;
    }

    public void setDepartureIds(List<Long> departureIds) {
        this.departureIds = departureIds;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Byte getType() {
        return type;
    }

    public void setType(Byte type) {
        this.type = type;
    }

    public String getTicketName() {
        return ticketName;
    }

    public void setTicketName(String ticketName) {
        this.ticketName = ticketName == null ? null : ticketName.trim();
    }

    public LocalDate getSuitableStartTime() {
        return suitableStartTime;
    }

    public void setSuitableStartTime(LocalDate suitableStartTime) {
        this.suitableStartTime = suitableStartTime;
    }

    public LocalDate getSuitableEndTime() {
        return suitableEndTime;
    }

    public void setSuitableEndTime(LocalDate suitableEndTime) {
        this.suitableEndTime = suitableEndTime;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getIntroduction() {
        return introduction;
    }

    public void setIntroduction(String introduction) {
        this.introduction = introduction == null ? null : introduction.trim();
    }

    public Byte getTicketStatus() {
        return ticketStatus;
    }

    public void setTicketStatus(Byte ticketStatus) {
        this.ticketStatus = ticketStatus;
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