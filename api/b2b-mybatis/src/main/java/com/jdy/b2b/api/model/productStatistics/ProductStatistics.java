package com.jdy.b2b.api.model.productStatistics;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

/**
 * Created by dugq on 2017/11/16.
 */
public class ProductStatistics<T> implements Serializable {
    private static final long serialVersionUID = -5782708963786639322L;
    private List<T> productList;
    private List<T> departmentList;
    private List<T> companyList;
    private List<T> agentList;
    private BigDecimal totalSales;
    private Integer totalOrderNum;
    private Integer totalTouristNum;
    private List<String> chartNameArray;
    private List<ProductPercent> chartObjectArray;
    private List<ParentOrder> list;


    public List<ParentOrder> getList() {
        return list;
    }

    public void setList(List<ParentOrder> list) {
        this.list = list;
    }

    public List<T> getCompanyList() {
        return companyList;
    }

    public void setCompanyList(List<T> companyList) {
        this.companyList = companyList;
    }

    public List<String> getChartNameArray() {
        return chartNameArray;
    }

    public List<T> getDepartmentList() {
        return departmentList;
    }

    public void setDepartmentList(List<T> departmentList) {
        this.departmentList = departmentList;
    }

    public List<T> getAgentList() {
        return agentList;
    }

    public void setAgentList(List<T> agentList) {
        this.agentList = agentList;
    }

    public void setChartNameArray(List<String> chartNameArray) {
        this.chartNameArray = chartNameArray;
    }

    public List<ProductPercent> getChartObjectArray() {
        return chartObjectArray;
    }

    public void setChartObjectArray(List<ProductPercent> chartObjectArray) {
        this.chartObjectArray = chartObjectArray;
    }

    public List<T> getProductList() {
        return productList;
    }

    public void setProductList(List<T> productList) {
        this.productList = productList;
    }

    public Integer getTotalTouristNum() {
        return totalTouristNum;
    }

    public void setTotalTouristNum(Integer totalTouristNum) {
        this.totalTouristNum = totalTouristNum;
    }

    public BigDecimal getTotalSales() {
        return totalSales;
    }

    public void setTotalSales(BigDecimal totalSales) {
        this.totalSales = totalSales;
    }

    public Integer getTotalOrderNum() {
        return totalOrderNum;
    }

    public void setTotalOrderNum(Integer totalOrderNum) {
        this.totalOrderNum = totalOrderNum;
    }
}
