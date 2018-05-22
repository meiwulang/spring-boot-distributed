package com.jdy.b2b.web.pojo.admission;

import io.swagger.annotations.ApiModelProperty;

import java.math.BigDecimal;

/**
 * Created by dugq on 2018/4/18.
 */
public class AdmissionProduceDto extends AdmissionProduce{

    @ApiModelProperty(value = "编码")
    private String ticketProductCode;

    @ApiModelProperty(value = "门票产品名称")
    private String ticketProductName;

    @ApiModelProperty(value = "门市价")
    private BigDecimal marketPrice;
    @ApiModelProperty(value = "同行价")
    private BigDecimal peerPrice;
    @ApiModelProperty(value = "产品经理")
    private String productManagerName;

    @ApiModelProperty(value = "成人票 0：儿童票")
    private Byte ticketProductType;



    public String getTicketProductCode() {
        return ticketProductCode;
    }

    public void setTicketProductCode(String ticketProductCode) {
        this.ticketProductCode = ticketProductCode;
    }

    public String getTicketProductName() {
        return ticketProductName;
    }

    public void setTicketProductName(String ticketProductName) {
        this.ticketProductName = ticketProductName;
    }

    public BigDecimal getMarketPrice() {
        return marketPrice;
    }

    public void setMarketPrice(BigDecimal marketPrice) {
        this.marketPrice = marketPrice;
    }

    public BigDecimal getPeerPrice() {
        return peerPrice;
    }

    public void setPeerPrice(BigDecimal peerPrice) {
        this.peerPrice = peerPrice;
    }

    public String getProductManagerName() {
        return productManagerName;
    }

    public void setProductManagerName(String productManagerName) {
        this.productManagerName = productManagerName;
    }

    public Byte getTicketProductType() {
        return ticketProductType;
    }

    public void setTicketProductType(Byte ticketProductType) {
        this.ticketProductType = ticketProductType;
    }
}
