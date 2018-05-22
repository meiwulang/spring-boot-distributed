package com.jdy.b2b.api.model.orderRefund;

import java.math.BigDecimal;

/**
 * Created by strict on 2018/5/9.
 * "ticketId":"1234",   //退款票id
 "priceName":"成人票", //票名称
 "num":"1",             //人数
 "price":"0.1",         //单价
 "categoryId":"1",     //类目
 "categoryName":"111"  //名称
 */
public class RefundSyncDTO {
    private Long ticketId;
    private String priceName;
    private Integer num;
    private BigDecimal price;
    private Long categoryId;
    private String categoryName;

    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }

    public String getPriceName() {
        return priceName;
    }

    public void setPriceName(String priceName) {
        this.priceName = priceName;
    }

    public Integer getNum() {
        return num;
    }

    public void setNum(Integer num) {
        this.num = num;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
}
