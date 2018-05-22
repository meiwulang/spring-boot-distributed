package com.jdy.b2b.api.model.diy;

import java.math.BigDecimal;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/12/26 15:07
 */
public class CardDO {
    private String cardNo;
    private String pass;

    private Integer cardType;

    private BigDecimal cardPrice;

    private Integer cardPerson;

    private Integer cardPersonPrior;

    private BigDecimal cardDiscountRate;

    private BigDecimal cardDiscountMax;

    public String getCardNo() {
        return cardNo;
    }

    public void setCardNo(String cardNo) {
        this.cardNo = cardNo;
    }

    public String getPass() {
        return pass;
    }

    public void setPass(String pass) {
        this.pass = pass;
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
