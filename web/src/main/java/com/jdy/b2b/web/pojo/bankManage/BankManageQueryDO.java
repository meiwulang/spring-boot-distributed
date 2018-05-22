package com.jdy.b2b.web.pojo.bankManage;


import java.util.Date;

/**
 * Created by yangcheng on 2017/8/31.
 */
public class BankManageQueryDO{
    private Long id;

    private String bCompanyName;

    private String bShortName;

    private String bBankNo;

    private String bBankPeople;
    //银行名称+支行名称
    private String bBankName;

    private Boolean bType;

    private Date createTime;


    //关联信息
    private Long bBbid;
    private String bProvince;
    private String bCity;
    //总行
    private String bHeadBankName;
    //支行
    private String bBankBranchName;
    private String bCurrency;
    private Integer bLicenceType;
    private String bLincese;


    public String getbShortName() {
        return bShortName;
    }

    public void setbShortName(String bShortName) {
        this.bShortName = bShortName;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getbBankBranchName() {
        return bBankBranchName;
    }

    public void setbBankBranchName(String bBankBranchName) {
        this.bBankBranchName = bBankBranchName;
    }

    public String getbProvince() {
        return bProvince;
    }

    public void setbProvince(String bProvince) {
        this.bProvince = bProvince;
    }

    public String getbCity() {
        return bCity;
    }

    public void setbCity(String bCity) {
        this.bCity = bCity;
    }

    public String getbHeadBankName() {
        return bHeadBankName;
    }

    public void setbHeadBankName(String bHeadBankName) {
        this.bHeadBankName = bHeadBankName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public String getbCompanyName() {
        return bCompanyName;
    }

    public void setbCompanyName(String bCompanyName) {
        this.bCompanyName = bCompanyName;
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
        this.bBankName = bBankName;
    }

    public String getbBankNo() {
        return bBankNo;
    }

    public void setbBankNo(String bBankNo) {
        this.bBankNo = bBankNo;
    }

    public String getbBankPeople() {
        return bBankPeople;
    }

    public void setbBankPeople(String bBankPeople) {
        this.bBankPeople = bBankPeople;
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
        this.bLincese = bLincese;
    }

    public String getbCurrency() {
        return bCurrency;
    }

    public void setbCurrency(String bCurrency) {
        this.bCurrency = bCurrency;
    }
}
