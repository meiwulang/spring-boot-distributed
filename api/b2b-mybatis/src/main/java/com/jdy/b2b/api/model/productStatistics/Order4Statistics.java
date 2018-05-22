package com.jdy.b2b.api.model.productStatistics;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

/**
 * Created by dugq on 2017/12/6.
 */
public class Order4Statistics implements Serializable {
    private static final long serialVersionUID = -8661336751553454478L;
    private Long productId;
    private String productName;
    private BigDecimal price;
    private int touristNum;
    private Long agentId;
    private String agentName;
    private Long departmentId;
    private String departmentName;
    private Long fistId;
    private LocalDate date;
    private Long companyId;
    private String firstCompanyId;
    private String companyName;


    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public boolean isDateInRange(LocalDate startDate, LocalDate endDate){
        if(Objects.isNull(startDate) || Objects.isNull(endDate))
            return true;
        if(startDate.isAfter(this.date))
            return false;
        return endDate.isAfter(this.date);
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public Long getFirstCompanyId() {
        return Objects.isNull(firstCompanyId)? null : Long.valueOf(firstCompanyId.substring(0,firstCompanyId.indexOf('-')));
    }

    public void setFirstCompanyId(String firstCompanyId) {
        this.firstCompanyId = firstCompanyId;
    }

    public boolean isProduct(Long id){
        return Objects.equals(this.productId,id);
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Long getFistId() {
        return fistId;
    }

    public void setFistId(Long fistId) {
        this.fistId = fistId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public int getTouristNum() {
        return touristNum;
    }

    public void setTouristNum(int touristNum) {
        this.touristNum = touristNum;
    }

    public Long getAgentId() {
        return agentId;
    }

    public void setAgentId(Long agentId) {
        this.agentId = agentId;
    }

    public String getAgentName() {
        return agentName;
    }

    public void setAgentName(String agentName) {
        this.agentName = agentName;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

}
