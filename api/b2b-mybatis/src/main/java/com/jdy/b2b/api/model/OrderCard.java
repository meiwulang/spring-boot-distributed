package com.jdy.b2b.api.model;

import java.math.BigDecimal;
import java.util.Date;

public class OrderCard {
    private Long id;

    private Long orderId;

    private String cardNo;

    private String cardPass;

    private String validTime;

    private Long userUid;

    private Date createTime;

    private Long createUser;

    private Date updateTime;

    private Long updateUser;

    private BigDecimal marketingPrice;

    private BigDecimal costPrice;

    private BigDecimal salePrice;

    private Integer cardType;

    private BigDecimal cardPrice;

    private Integer cardPerson;

    private Integer cardPersonPrior;

    private BigDecimal cardDiscountRate;

    private BigDecimal cardDiscountMax;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getCardNo() {
        return cardNo;
    }

    public void setCardNo(String cardNo) {
        this.cardNo = cardNo == null ? null : cardNo.trim();
    }

    public String getCardPass() {
        return cardPass;
    }

    public void setCardPass(String cardPass) {
        this.cardPass = cardPass == null ? null : cardPass.trim();
    }

    public String getValidTime() {
        return validTime;
    }

    public void setValidTime(String validTime) {
        this.validTime = validTime == null ? null : validTime.trim();
    }

    public Long getUserUid() {
        return userUid;
    }

    public void setUserUid(Long userUid) {
        this.userUid = userUid;
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

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public Long getUpdateUser() {
        return updateUser;
    }

    public void setUpdateUser(Long updateUser) {
        this.updateUser = updateUser;
    }

    public BigDecimal getMarketingPrice() {
        return marketingPrice;
    }

    public void setMarketingPrice(BigDecimal marketingPrice) {
        this.marketingPrice = marketingPrice;
    }

    public BigDecimal getCostPrice() {
        return costPrice;
    }

    public void setCostPrice(BigDecimal costPrice) {
        this.costPrice = costPrice;
    }

    public BigDecimal getSalePrice() {
        return salePrice;
    }

    public void setSalePrice(BigDecimal salePrice) {
        this.salePrice = salePrice;
    }

    public Integer getCardType() {
        return cardType;
    }

    public void setCardType(Integer cardType) {
        this.cardType = cardType;
    }

    public BigDecimal getCardPrice() {
        return cardPrice;
    }

    public void setCardPrice(BigDecimal cardPrice) {
        this.cardPrice = cardPrice;
    }

    public Integer getCardPerson() {
        return cardPerson;
    }

    public void setCardPerson(Integer cardPerson) {
        this.cardPerson = cardPerson;
    }

    public Integer getCardPersonPrior() {
        return cardPersonPrior;
    }

    public void setCardPersonPrior(Integer cardPersonPrior) {
        this.cardPersonPrior = cardPersonPrior;
    }

    public BigDecimal getCardDiscountRate() {
        return cardDiscountRate;
    }

    public void setCardDiscountRate(BigDecimal cardDiscountRate) {
        this.cardDiscountRate = cardDiscountRate;
    }

    public BigDecimal getCardDiscountMax() {
        return cardDiscountMax;
    }

    public void setCardDiscountMax(BigDecimal cardDiscountMax) {
        this.cardDiscountMax = cardDiscountMax;
    }
}