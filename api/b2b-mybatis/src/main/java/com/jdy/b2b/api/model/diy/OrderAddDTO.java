package com.jdy.b2b.api.model.diy;

import com.jdy.b2b.api.model.Order;

import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/9/19 11:31
 */
public class OrderAddDTO extends Order {
    private List<CardDO> cardDOS;
    private String appletId;//小程序openid

    private List<OrderPriceDetailVO> priceDetails;

    private List<OrderTouristAddVO> tourists;

    private Integer bookType;
    private Integer pFirstPayType;//首付款类型 1:固定金额(每人) 2:百分比(订单总额)

    public Integer getBookType() {
        return bookType;
    }

    public void setBookType(Integer bookType) {
        this.bookType = bookType;
    }

    public List<OrderPriceDetailVO> getPriceDetails() {
        return priceDetails;
    }

    public void setPriceDetails(List<OrderPriceDetailVO> priceDetails) {
        this.priceDetails = priceDetails;
    }

    public List<OrderTouristAddVO> getTourists() {
        return tourists;
    }

    public void setTourists(List<OrderTouristAddVO> tourists) {
        this.tourists = tourists;
    }

    public List<CardDO> getCardDOS() {
        return cardDOS;
    }

    public void setCardDOS(List<CardDO> cardDOS) {
        this.cardDOS = cardDOS;
    }

    public String getAppletId() {
        return appletId;
    }

    public void setAppletId(String appletId) {
        this.appletId = appletId;
    }

    public Integer getpFirstPayType() {
        return pFirstPayType;
    }

    public void setpFirstPayType(Integer pFirstPayType) {
        this.pFirstPayType = pFirstPayType;
    }
}
