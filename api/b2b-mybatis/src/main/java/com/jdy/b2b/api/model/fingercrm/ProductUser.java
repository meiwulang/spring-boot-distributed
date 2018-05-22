package com.jdy.b2b.api.model.fingercrm;

import java.math.BigDecimal;
import java.util.Date;

public class ProductUser {
    private Long id;

    private String uid;

    private Long pNo;

    private Long tId;

    private Long tCategroyId;

    private Long tCompanyId;

    private Long createUser;

    private Date createTime;

    private Long updateUser;

    private Date updateTime;

    private BigDecimal brokerage1;

    private BigDecimal brokerage2;

    private BigDecimal brokerage3;

    private Integer brokerageType;

    public static ProductUser buildBy(String opendId, Long companyId, ProductTicketSyncDTO syncDTO){
        ProductUser productUser = new ProductUser();
        productUser.setBrokerage1(new BigDecimal(syncDTO.getBrokerage1()));
        productUser.setBrokerage2(new BigDecimal(syncDTO.getBrokerage2()));
        productUser.setBrokerage3(new BigDecimal(syncDTO.getBrokerage3()));
        productUser.setBrokerageType(syncDTO.getRebateType());
        productUser.setpNo(syncDTO.getProductId());
        productUser.setUid(opendId);
        productUser.setCreateTime(new Date());
        productUser.settCategroyId(syncDTO.getCategoryId());
        productUser.settId(syncDTO.getUnitPriceId());
        productUser.settCompanyId(companyId);
        return productUser;
    }

    public Long gettCompanyId() {
        return tCompanyId;
    }

    public void settCompanyId(Long tCompanyId) {
        this.tCompanyId = tCompanyId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid == null ? null : uid.trim();
    }

    public Long getpNo() {
        return pNo;
    }

    public void setpNo(Long pNo) {
        this.pNo = pNo;
    }

    public Long gettId() {
        return tId;
    }

    public void settId(Long tId) {
        this.tId = tId;
    }

    public Long gettCategroyId() {
        return tCategroyId;
    }

    public void settCategroyId(Long tCategroyId) {
        this.tCategroyId = tCategroyId;
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

    public Integer getBrokerageType() {
        return brokerageType;
    }

    public void setBrokerageType(Integer brokerageType) {
        this.brokerageType = brokerageType;
    }
}