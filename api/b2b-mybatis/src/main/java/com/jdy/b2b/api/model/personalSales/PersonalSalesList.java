package com.jdy.b2b.api.model.personalSales;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

/**
 * Created by dugq on 2017/12/18.
 */
public class PersonalSalesList implements Serializable {
    private static final long serialVersionUID = 4465857134355032191L;

    private String userName;
    private String departmentName;
    private BigDecimal sales;
    private BigDecimal brokerage;
    private Integer orderNum;
    private Integer touristNum;
    private String parentName;
    private Long departmentId;
    private Long companyId;
    private String companyName;
    private String firstCompanyId;

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
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

    public Long getFirstCompanyId() {
        return Objects.isNull(firstCompanyId)? null : Long.valueOf(firstCompanyId.substring(0,firstCompanyId.indexOf('-')));
    }

    public void setFirstCompanyId(String firstCompanyId) {
        this.firstCompanyId = firstCompanyId;
    }

    public String getParentName() {
        return parentName;
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public BigDecimal getSales() {
        return sales;
    }

    public void setSales(BigDecimal sales) {
        this.sales = sales;
    }

    public BigDecimal getBrokerage() {
        return brokerage;
    }

    public void setBrokerage(BigDecimal brokerage) {
        this.brokerage = brokerage;
    }

    public Integer getOrderNum() {
        return orderNum;
    }

    public void setOrderNum(Integer orderNum) {
        this.orderNum = orderNum;
    }

    public Integer getTouristNum() {
        return touristNum;
    }

    public void setTouristNum(Integer touristNum) {
        this.touristNum = touristNum;
    }
}
