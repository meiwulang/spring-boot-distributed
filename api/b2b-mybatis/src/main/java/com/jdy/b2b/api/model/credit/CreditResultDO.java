package com.jdy.b2b.api.model.credit;

import com.jdy.b2b.api.common.BaseVO;

import java.math.BigDecimal;

/**
 * Created by yangcheng on 2017/8/30.
 */
public class CreditResultDO extends BaseVO{

    private Long id;

    private String cSupplierName;

    private String cDistributorName;

    private BigDecimal cCreditQuota;

    private BigDecimal cCreditBalance;

    private BigDecimal cCreditUsed;

    private Integer cSettlementCycle;

    private Integer cSettlementDay;

    private String cProductType;

    //分销商数据

    private String cProvince;

    private String cCity;

    private String cArea;

    private String cNo;

    public BigDecimal getcCreditUsed() {
        return cCreditUsed;
    }

    public void setcCreditUsed(BigDecimal cCreditUsed) {
        this.cCreditUsed = cCreditUsed;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getcSupplierName() {
        return cSupplierName;
    }

    public void setcSupplierName(String cSupplierName) {
        this.cSupplierName = cSupplierName;
    }

    public String getcDistributorName() {
        return cDistributorName;
    }

    public void setcDistributorName(String cDistributorName) {
        this.cDistributorName = cDistributorName;
    }

    public String getcProvince() {
        return cProvince;
    }

    public void setcProvince(String cProvince) {
        this.cProvince = cProvince;
    }

    public String getcCity() {
        return cCity;
    }

    public void setcCity(String cCity) {
        this.cCity = cCity;
    }

    public String getcArea() {
        return cArea;
    }

    public void setcArea(String cArea) {
        this.cArea = cArea;
    }

    public BigDecimal getcCreditQuota() {
        return cCreditQuota;
    }

    public void setcCreditQuota(BigDecimal cCreditQuota) {
        this.cCreditQuota = cCreditQuota;
    }

    public BigDecimal getcCreditBalance() {
        return cCreditBalance;
    }

    public void setcCreditBalance(BigDecimal cCreditBalance) {
        this.cCreditBalance = cCreditBalance;
    }

    public Integer getcSettlementCycle() {
        return cSettlementCycle;
    }

    public void setcSettlementCycle(Integer cSettlementCycle) {
        this.cSettlementCycle = cSettlementCycle;
    }

    public Integer getcSettlementDay() {
        return cSettlementDay;
    }

    public void setcSettlementDay(Integer cSettlementDay) {
        this.cSettlementDay = cSettlementDay;
    }

    public String getcProductType() {
        return cProductType;
    }

    public void setcProductType(String cProductType) {
        this.cProductType = cProductType;
    }

    public String getcNo() {
        return cNo;
    }

    public void setcNo(String cNo) {
        this.cNo = cNo;
    }
}
