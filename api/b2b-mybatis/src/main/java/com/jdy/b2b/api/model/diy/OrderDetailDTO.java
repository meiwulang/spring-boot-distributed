package com.jdy.b2b.api.model.diy;

import com.alibaba.fastjson.JSON;
import com.jdy.b2b.api.model.Order;
import com.jdy.b2b.api.model.OrderCard;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.springframework.util.CollectionUtils.isEmpty;

/**
 * @Description 订单详情
 * @Author yyf
 * @DateTime 2017/9/5 10:45
 */
public class OrderDetailDTO extends Order {
    //产品类型
    private Integer pType;
    private String pNo;
    private String pName;
    //行程天数
    private Integer pDays;
    //出发日期
    private Date sCalendar;
    private Date sCalendarBack;

    private String salerPhone;
    private String buyerPhone;

    private List<OrderPriceDetailDTO> priceDetails;

    private List<OrderTouristDTO> tourists;
    private List<OrderCard> orderCards;

    private BigDecimal lossMoney;

    private String touristsJson;

    public BigDecimal getLossMoney() {
        return lossMoney;
    }

    public void setLossMoney(BigDecimal lossMoney) {
        this.lossMoney = lossMoney;
    }

    public Integer getpType() {
        return pType;
    }

    public void setpType(Integer pType) {
        this.pType = pType;
    }

    public String getpNo() {
        return pNo;
    }

    public void setpNo(String pNo) {
        this.pNo = pNo;
    }

    public String getpName() {
        return pName;
    }

    public void setpName(String pName) {
        this.pName = pName;
    }

    public Integer getpDays() {
        return pDays;
    }

    public void setpDays(Integer pDays) {
        this.pDays = pDays;
    }

    public Date getsCalendar() {
        return sCalendar;
    }

    public void setsCalendar(Date sCalendar) {
        this.sCalendar = sCalendar;
    }


    public Date getsCalendarBack() {
        return sCalendarBack;
    }

    public void setsCalendarBack(Date sCalendarBack) {
        this.sCalendarBack = sCalendarBack;
    }

    public List<OrderPriceDetailDTO> getPriceDetails() {
        return priceDetails;
    }

    public void setPriceDetails(List<OrderPriceDetailDTO> priceDetails) {
        this.priceDetails = priceDetails;
    }

    public List<OrderTouristDTO> getTourists() {
        return tourists;
    }

    public void setTourists(List<OrderTouristDTO> tourists) {
        this.tourists = tourists;
    }

    public String getTouristsJson() {
        if (isEmpty(tourists)) return "";
        List<Object> res = new ArrayList<>();
        res.addAll(tourists.stream().filter(t -> t.getOtTicketType() == 0).collect(Collectors.toList()));
        Map map = tourists.stream().filter(t -> t.getOtTicketType() == 1).collect(Collectors.groupingBy(o -> o.getOtTicketId()));
        if (!map.isEmpty()) {
            res.add(map);
        }
        return JSON.toJSONString(res);
    }

    public String getSalerPhone() {
        return salerPhone;
    }

    public void setSalerPhone(String salerPhone) {
        this.salerPhone = salerPhone;
    }

    public String getBuyerPhone() {
        return buyerPhone;
    }

    public void setBuyerPhone(String buyerPhone) {
        this.buyerPhone = buyerPhone;
    }

    public List<OrderCard> getOrderCards() {
        return orderCards;
    }

    public void setOrderCards(List<OrderCard> orderCards) {
        this.orderCards = orderCards;
    }
}
