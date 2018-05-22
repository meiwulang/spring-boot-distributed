package com.jdy.b2b.api.vo.credit;



import com.jdy.b2b.api.common.BaseVO;

import java.math.BigDecimal;

/**
 * Created by yangcheng on 2017/8/30.
 */
public class CreditSaveOrUpdateVo extends BaseVO {
    private Long id;

    private Long cSupplierId;

    private String cSupplierName;

    private Long cDistributorId;

    private String cDistributorName;

    private BigDecimal cCreditQuota;

    private BigDecimal cCreditBalance;

    private BigDecimal cCreditUsed;

    private Integer cSettlementCycle;

    private Integer cSettlementDay;

    private String cProductType;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getcSupplierId() {
        return cSupplierId;
    }

    public void setcSupplierId(Long cSupplierId) {
        this.cSupplierId = cSupplierId;
    }

    public String getcSupplierName() {
        return cSupplierName;
    }

    public void setcSupplierName(String cSupplierName) {
        this.cSupplierName = cSupplierName;
    }

    public Long getcDistributorId() {
        return cDistributorId;
    }

    public void setcDistributorId(Long cDistributorId) {
        this.cDistributorId = cDistributorId;
    }

    public String getcDistributorName() {
        return cDistributorName;
    }

    public void setcDistributorName(String cDistributorName) {
        this.cDistributorName = cDistributorName;
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

    public BigDecimal getcCreditUsed() {
        return cCreditUsed;
    }

    public void setcCreditUsed(BigDecimal cCreditUsed) {
        this.cCreditUsed = cCreditUsed;
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
}
