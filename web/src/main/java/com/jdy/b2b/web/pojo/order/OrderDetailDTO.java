package com.jdy.b2b.web.pojo.order;

import com.alibaba.fastjson.JSON;
import com.jdy.b2b.web.enums.ProductTypeEnum;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

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
@ApiModel(description = "订单详情dto")
public class OrderDetailDTO extends Order {
    @ApiModelProperty(value = "产品类型")
    private Integer pType;
    @ApiModelProperty(value = "产品编号")
    private String pNo;
    @ApiModelProperty(value = "产品名称")
    private String pName;
    @ApiModelProperty(value = "行程天数")
    private Integer pDays;
    @ApiModelProperty(value = "出发日期")
    private Date sCalendar;
    @ApiModelProperty(value = "回程日期")
    private Date sCalendarBack;

    @ApiModelProperty(value = "卖家计调手机")
    private String salerPhone;
    @ApiModelProperty(value = "买家下单人手机")
    private String buyerPhone;

    @ApiModelProperty(value = "价格详情")
    private List<OrderPriceDetailDTO> priceDetails;

    @ApiModelProperty(value = "游客信息")
    private List<OrderTouristDTO> tourists;

    @ApiModelProperty(value = "合同JSON")
    private OrderContract orderContract;
    @ApiModelProperty(value = "礼品卡")
    private List<OrderCard> orderCards;

    @ApiModelProperty(value = "游客信息JSON")
    private String touristsJson;

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

    @ApiModelProperty(value = "产品类型名称")
    public String getPTypeName() {
        return ProductTypeEnum.getDescByValue(pType);
    }

    public Date getsCalendarBack() {
        return sCalendarBack;
    }

    public void setsCalendarBack(Date sCalendarBack) {
        this.sCalendarBack = sCalendarBack;
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

    public OrderContract getOrderContract() {
        return orderContract;
    }

    public void setOrderContract(OrderContract orderContract) {
        this.orderContract = orderContract;
    }

    public List<OrderCard> getOrderCards() {
        return orderCards;
    }

    public void setOrderCards(List<OrderCard> orderCards) {
        this.orderCards = orderCards;
    }
}
