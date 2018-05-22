package com.jdy.b2b.api.model.fingercrm;

import java.math.BigDecimal;

/**
 * Created by strict on 2018/1/17.
 */
public class TicketInfo {
    private Integer stock;//库存
    private BigDecimal unit_pirce;//产品单价 门市价
    private BigDecimal gatherPrice;
    private BigDecimal factoryPrice;
    private Long unitPriceId; //票 id
    private String priceName;//票名
    private String lastUpdateTime;
    private Long companyId;
    private String companyName;
    private Integer ticketType;//票类型
    private String ticketTypeName;//
    private Integer trafficType;
    private String trafficName;
    private Integer isGather;
    private Long fromTicketId;

    private String startPlace;
    private Long startPlaceId;
    private Long endPlaceId;
    private String endPlace;
    public BigDecimal getFactoryPrice() {
        return factoryPrice;
    }

    public void setFactoryPrice(BigDecimal factoryPrice) {
        this.factoryPrice = factoryPrice;
    }

    public Long getStartPlaceId() {
        return startPlaceId;
    }

    public void setStartPlaceId(Long startPlaceId) {
        this.startPlaceId = startPlaceId;
    }

    public Long getEndPlaceId() {
        return endPlaceId;
    }

    public void setEndPlaceId(Long endPlaceId) {
        this.endPlaceId = endPlaceId;
    }

    public String getStartPlace() {
        return startPlace;
    }

    public void setStartPlace(String startPlace) {
        this.startPlace = startPlace;
    }

    public String getEndPlace() {
        return endPlace;
    }

    public void setEndPlace(String endPlace) {
        this.endPlace = endPlace;
    }

    public Long getFromTicketId() {
        return fromTicketId;
    }

    public void setFromTicketId(Long fromTicketId) {
        this.fromTicketId = fromTicketId;
    }

    public Integer getIsGather() {
        return isGather;
    }

    public void setIsGather(Integer isGather) {
        this.isGather = isGather;
    }

    public BigDecimal getGatherPrice() {
        return gatherPrice;
    }

    public void setGatherPrice(BigDecimal gatherPrice) {
        this.gatherPrice = gatherPrice;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public Integer getTicketType() {
        return ticketType;
    }

    public void setTicketType(Integer ticketType) {
        this.ticketType = ticketType;
    }

    public String getTicketTypeName() {
        return ticketTypeName;
    }

    public void setTicketTypeName(String ticketTypeName) {
        this.ticketTypeName = ticketTypeName;
    }

    public Integer getTrafficType() {
        return trafficType;
    }

    public void setTrafficType(Integer trafficType) {
        this.trafficType = trafficType;
    }

    public String getTrafficName() {
        return trafficName;
    }

    public void setTrafficName(String trafficName) {
        this.trafficName = trafficName;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public BigDecimal getUnit_pirce() {
        return unit_pirce;
    }

    public void setUnit_pirce(BigDecimal unit_pirce) {
        this.unit_pirce = unit_pirce;
    }

    public Long getUnitPriceId() {
        return unitPriceId;
    }

    public void setUnitPriceId(Long unitPriceId) {
        this.unitPriceId = unitPriceId;
    }

    public String getPriceName() {
        return priceName;
    }

    public void setPriceName(String priceName) {
        this.priceName = priceName;
    }

    public String getLastUpdateTime() {
        return lastUpdateTime;
    }

    public void setLastUpdateTime(String lastUpdateTime) {
        this.lastUpdateTime = lastUpdateTime;
    }
}
