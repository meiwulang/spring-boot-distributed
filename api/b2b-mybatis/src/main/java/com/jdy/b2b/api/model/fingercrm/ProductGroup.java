package com.jdy.b2b.api.model.fingercrm;

import java.math.BigDecimal;
import java.util.Date;

public class ProductGroup {
    private Long id;

    private Long pNo;

    private String gNo;

    private Long tId;

    private Long tCategoryId;

    private Long companyId;

    private Long createUser;

    private Date createTime;

    private Long updateUser;

    private Date updateTime;

    private Integer brokerageType;

    private BigDecimal brokerage1;

    private BigDecimal brokerage2;

    private BigDecimal brokerage3;


    public static ProductGroup buildBy(String gNo, Long companyId, ProductTicketSyncDTO syncDTO){
        ProductGroup productGroup =new ProductGroup();
        productGroup.setgNo(gNo);
        productGroup.setCreateTime(new Date());
        productGroup.settId(syncDTO.getUnitPriceId());
        productGroup.settCategoryId(syncDTO.getCategoryId());
        productGroup.setCompanyId(companyId);
        productGroup.setpNo(syncDTO.getProductId());
        productGroup.setBrokerageType(syncDTO.getRebateType());
        productGroup.setBrokerage1(new BigDecimal(syncDTO.getBrokerage1()));
        productGroup.setBrokerage2(new BigDecimal(syncDTO.getBrokerage2()));
        productGroup.setBrokerage3(new BigDecimal(syncDTO.getBrokerage3()));
        return productGroup;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public Integer getBrokerageType() {
        return brokerageType;
    }

    public void setBrokerageType(Integer brokerageType) {
        this.brokerageType = brokerageType;
    }

    public BigDecimal getBrokerage1() {
        return brokerage1;
    }

    public void setBrokerage1(BigDecimal brokerage1) {
        this.brokerage1 = brokerage1;
    }

    public BigDecimal getBrokerage2() {
        return brokerage2;
    }

    public void setBrokerage2(BigDecimal brokerage2) {
        this.brokerage2 = brokerage2;
    }

    public BigDecimal getBrokerage3() {
        return brokerage3;
    }

    public void setBrokerage3(BigDecimal brokerage3) {
        this.brokerage3 = brokerage3;
    }

    public Long gettId() {
        return tId;
    }

    public void settId(Long tId) {
        this.tId = tId;
    }

    public Long gettCategoryId() {
        return tCategoryId;
    }

    public void settCategoryId(Long tCategoryId) {
        this.tCategoryId = tCategoryId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getpNo() {
        return pNo;
    }

    public void setpNo(Long pNo) {
        this.pNo = pNo;
    }

    public String getgNo() {
        return gNo;
    }

    public void setgNo(String gNo) {
        this.gNo = gNo == null ? null : gNo.trim();
    }

    public Long getCreateUser() {
        return createUser;
    }

    public void setCreateUser(Long createUser) {
        this.createUser = createUser;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Long getUpdateUser() {
        return updateUser;
    }

    public void setUpdateUser(Long updateUser) {
        this.updateUser = updateUser;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }
}