package com.jdy.b2b.api.model.reports;

import java.math.BigDecimal;

/**
 * Created by yangcheng on 2017/9/11.
 */
public class BuyerCountDO {
    private Long companyId;
    private String cName;
    private String province;
    private String city;
    private String area;
    private Integer orderCounts;
    private Integer salerCounts;
    private Integer productCounts;
    private Integer peopleNum;
    private BigDecimal marketAmount;
    private BigDecimal totalAmount;
    //手动设置
    private Integer childAmount;
    private Integer adultAmount;

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getcName() {
        return cName;
    }

    public void setcName(String cName) {
        this.cName = cName;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public Integer getOrderCounts() {
        return orderCounts;
    }

    public void setOrderCounts(Integer orderCounts) {
        this.orderCounts = orderCounts;
    }

    public Integer getSalerCounts() {
        return salerCounts;
    }

    public void setSalerCounts(Integer salerCounts) {
        this.salerCounts = salerCounts;
    }

    public Integer getProductCounts() {
        return productCounts;
    }

    public void setProductCounts(Integer productCounts) {
        this.productCounts = productCounts;
    }

    public Integer getPeopleNum() {
        return peopleNum;
    }

    public void setPeopleNum(Integer peopleNum) {
        this.peopleNum = peopleNum;
    }

    public BigDecimal getMarketAmount() {
        return marketAmount;
    }

    public void setMarketAmount(BigDecimal marketAmount) {
        this.marketAmount = marketAmount;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Integer getChildAmount() {
        return childAmount;
    }

    public void setChildAmount(Integer childAmount) {
        this.childAmount = childAmount;
    }

    public Integer getAdultAmount() {
        return adultAmount;
    }

    public void setAdultAmount(Integer adultAmount) {
        this.adultAmount = adultAmount;
    }
}
