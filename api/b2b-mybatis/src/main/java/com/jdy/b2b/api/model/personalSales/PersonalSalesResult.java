package com.jdy.b2b.api.model.personalSales;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

/**
 * Created by dugq on 2017/12/19.
 */
public class PersonalSalesResult implements Serializable{
    private static final long serialVersionUID = -8873777476453290884L;

    List<PersonalSalesList> list;
    private BigDecimal totalSales;
    private BigDecimal totalBrokerage;
    private Integer totalOrderNum;
    private Integer totalTouristNum;

    public PersonalSalesResult() {
    }

    public PersonalSalesResult(List<PersonalSalesList> list) {
        this.list = list;
        this.totalSales = new BigDecimal(0);
        this.totalBrokerage = new BigDecimal(0);
        this.totalOrderNum = 0;
        this.totalTouristNum = 0;
        list.forEach(personalSalesList -> {
            if(!Objects.isNull(personalSalesList.getSales())){
                this.totalSales = this.totalSales.add(personalSalesList.getSales());
            }else{
                personalSalesList.setSales(new BigDecimal(0));
            }
            if(!Objects.isNull(personalSalesList.getBrokerage())){
                this.totalBrokerage = this.totalBrokerage.add(personalSalesList.getBrokerage());
            }else{
                personalSalesList.setBrokerage(new BigDecimal(0));
            }
            if(!Objects.isNull(personalSalesList.getOrderNum())){
                this.totalOrderNum += personalSalesList.getOrderNum();
            }else{
                personalSalesList.setOrderNum(0);
            }
            if(!Objects.isNull(personalSalesList.getTouristNum())){
                this.totalTouristNum += personalSalesList.getTouristNum();
            }else{
                personalSalesList.setTouristNum(0);
            }

        });
    }

    public List<PersonalSalesList> getList() {
        return list;
    }

    public void setList(List<PersonalSalesList> list) {
        this.list = list;
    }

    public BigDecimal getTotalSales() {
        return totalSales;
    }

    public void setTotalSales(BigDecimal totalSales) {
        this.totalSales = totalSales;
    }

    public BigDecimal getTotalBrokerage() {
        return totalBrokerage;
    }

    public void setTotalBrokerage(BigDecimal totalBrokerage) {
        this.totalBrokerage = totalBrokerage;
    }

    public Integer getTotalOrderNum() {
        return totalOrderNum;
    }

    public void setTotalOrderNum(Integer totalOrderNum) {
        this.totalOrderNum = totalOrderNum;
    }

    public Integer getTotalTouristNum() {
        return totalTouristNum;
    }

    public void setTotalTouristNum(Integer totalTouristNum) {
        this.totalTouristNum = totalTouristNum;
    }
}
