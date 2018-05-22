package com.jdy.b2b.api.model;

import java.math.BigDecimal;
import java.util.Date;

public class CompanySetting {
    private Long id;

    private Long csCompanyId;

    private BigDecimal csBankRate;

    private BigDecimal csQrRate;

    private BigDecimal csSettlementRate;

    private Integer csSettlement;

    private Integer csCycle;

    private Boolean csInvoiceEdit;

    private Boolean csQr;

    private Integer csAmount;

    private Boolean csSortBy;

    private Integer csStopDay;

    private Date csStopTime;

    private Date createTime;

    private Long createUser;

    private Date updateTime;

    private Long updateUser;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCsCompanyId() {
        return csCompanyId;
    }

    public void setCsCompanyId(Long csCompanyId) {
        this.csCompanyId = csCompanyId;
    }

    public BigDecimal getCsBankRate() {
        return csBankRate;
    }

    public void setCsBankRate(BigDecimal csBankRate) {
        this.csBankRate = csBankRate;
    }

    public BigDecimal getCsQrRate() {
        return csQrRate;
    }

    public void setCsQrRate(BigDecimal csQrRate) {
        this.csQrRate = csQrRate;
    }

    public Integer getCsSettlement() {
        return csSettlement;
    }

    public void setCsSettlement(Integer csSettlement) {
        this.csSettlement = csSettlement;
    }

    public Integer getCsCycle() {
        return csCycle;
    }

    public void setCsCycle(Integer csCycle) {
        this.csCycle = csCycle;
    }

    public Boolean getCsInvoiceEdit() {
        return csInvoiceEdit;
    }

    public void setCsInvoiceEdit(Boolean csInvoiceEdit) {
        this.csInvoiceEdit = csInvoiceEdit;
    }

    public Boolean getCsQr() {
        return csQr;
    }

    public void setCsQr(Boolean csQr) {
        this.csQr = csQr;
    }

    public Integer getCsAmount() {
        return csAmount;
    }

    public void setCsAmount(Integer csAmount) {
        this.csAmount = csAmount;
    }

    public Boolean getCsSortBy() {
        return csSortBy;
    }

    public void setCsSortBy(Boolean csSortBy) {
        this.csSortBy = csSortBy;
    }

    public Integer getCsStopDay() {
        return csStopDay;
    }

    public void setCsStopDay(Integer csStopDay) {
        this.csStopDay = csStopDay;
    }

    public Date getCsStopTime() {
        return csStopTime;
    }

    public void setCsStopTime(Date csStopTime) {
        this.csStopTime = csStopTime;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Long getCreateUser() {
        return createUser;
    }

    public void setCreateUser(Long createUser) {
        this.createUser = createUser;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public Long getUpdateUser() {
        return updateUser;
    }

    public void setUpdateUser(Long updateUser) {
        this.updateUser = updateUser;
    }

    public BigDecimal getCsSettlementRate() {
        return csSettlementRate;
    }

    public void setCsSettlementRate(BigDecimal csSettlementRate) {
        this.csSettlementRate = csSettlementRate;
    }
}