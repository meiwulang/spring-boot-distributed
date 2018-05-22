package com.jdy.b2b.web.pojo.bankManage;

import java.util.Date;

public class BankManage {
    private Long id;

    private Long bCompanyId;

    private String bCompanyName;

    private String bShortName;

    private Long bBbid;

    private String bBankName;

    private String bBankNo;

    private String bBankPeople;

    private Boolean bType;

    private Integer bLicenceType;

    private String bLincese;

    private String bCurrency;

    private Boolean bStatus;

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

    public Long getbCompanyId() {
        return bCompanyId;
    }

    public void setbCompanyId(Long bCompanyId) {
        this.bCompanyId = bCompanyId;
    }

    public String getbCompanyName() {
        return bCompanyName;
    }

    public void setbCompanyName(String bCompanyName) {
        this.bCompanyName = bCompanyName == null ? null : bCompanyName.trim();
    }

    public String getbShortName() {
        return bShortName;
    }

    public void setbShortName(String bShortName) {
        this.bShortName = bShortName == null ? null : bShortName.trim();
    }

    public Long getbBbid() {
        return bBbid;
    }

    public void setbBbid(Long bBbid) {
        this.bBbid = bBbid;
    }

    public String getbBankName() {
        return bBankName;
    }

    public void setbBankName(String bBankName) {
        this.bBankName = bBankName == null ? null : bBankName.trim();
    }

    public String getbBankNo() {
        return bBankNo;
    }

    public void setbBankNo(String bBankNo) {
        this.bBankNo = bBankNo == null ? null : bBankNo.trim();
    }

    public String getbBankPeople() {
        return bBankPeople;
    }

    public void setbBankPeople(String bBankPeople) {
        this.bBankPeople = bBankPeople == null ? null : bBankPeople.trim();
    }

    public Boolean getbType() {
        return bType;
    }

    public void setbType(Boolean bType) {
        this.bType = bType;
    }

    public Integer getbLicenceType() {
        return bLicenceType;
    }

    public void setbLicenceType(Integer bLicenceType) {
        this.bLicenceType = bLicenceType;
    }

    public String getbLincese() {
        return bLincese;
    }

    public void setbLincese(String bLincese) {
        this.bLincese = bLincese == null ? null : bLincese.trim();
    }

    public String getbCurrency() {
        return bCurrency;
    }

    public void setbCurrency(String bCurrency) {
        this.bCurrency = bCurrency;
    }

    public Boolean getbStatus() {
        return bStatus;
    }

    public void setbStatus(Boolean bStatus) {
        this.bStatus = bStatus;
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
}