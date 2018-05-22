package com.jdy.b2b.api.model.bill;

import com.jdy.b2b.api.common.BaseVO;

import java.math.BigDecimal;
import java.util.Date;

public class Bill extends BaseVO{
    private Long id;

    private String bBillNo;

    private Long bSalerCompanyId;

    private String bSalerCompanyName;

    private Long bSalerId;

    private String bSalerName;

    private BigDecimal bAmount = new BigDecimal(0);

    private BigDecimal bPayedAmount = new BigDecimal(0);

    private BigDecimal bBrokerage = new BigDecimal(0);

    private BigDecimal bDeduction = new BigDecimal(0);//信用账单一次性销帐时可减免一定的费用

    private Date bCashTime;

    private Date bRepaymentTime;//还款时间

    private Integer bType;

    private Integer bStatus;

    private String bRemark;

    private Date createTime;

    private Long createUser;

    private Date updateTime;

    private Long updateUser;

    private Long bBillPid;

    private Byte bBillType;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getbBillNo() {
        return bBillNo;
    }

    public void setbBillNo(String bBillNo) {
        this.bBillNo = bBillNo;
    }

    public Long getbSalerId() {
        return bSalerId;
    }

    public void setbSalerId(Long bSalerId) {
        this.bSalerId = bSalerId;
    }

    public String getbSalerName() {
        return bSalerName;
    }

    public void setbSalerName(String bSalerName) {
        this.bSalerName = bSalerName;
    }

    public BigDecimal getbAmount() {
        return bAmount;
    }

    public void setbAmount(BigDecimal bAmount) {
        this.bAmount = bAmount;
    }

    public BigDecimal getbPayedAmount() {
        return bPayedAmount;
    }

    public void setbPayedAmount(BigDecimal bPayedAmount) {
        this.bPayedAmount = bPayedAmount;
    }

    public BigDecimal getbBrokerage() {
        return bBrokerage;
    }

    public void setbBrokerage(BigDecimal bBrokerage) {
        this.bBrokerage = bBrokerage;
    }

    public BigDecimal getbDeduction() {
        return bDeduction;
    }

    public void setbDeduction(BigDecimal bDeduction) {
        this.bDeduction = bDeduction;
    }

    public Date getbCashTime() {
        return bCashTime;
    }

    public void setbCashTime(Date bCashTime) {
        this.bCashTime = bCashTime;
    }

    public Date getbRepaymentTime() {
        return bRepaymentTime;
    }

    public void setbRepaymentTime(Date bRepaymentTime) {
        this.bRepaymentTime = bRepaymentTime;
    }

    public Integer getbType() {
        return bType;
    }

    public void setbType(Integer bType) {
        this.bType = bType;
    }

    public Integer getbStatus() {
        return bStatus;
    }

    public void setbStatus(Integer bStatus) {
        this.bStatus = bStatus;
    }

    public String getbRemark() {
        return bRemark;
    }

    public void setbRemark(String bRemark) {
        this.bRemark = bRemark;
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

    public Long getbBillPid() {
        return bBillPid;
    }

    public void setbBillPid(Long bBillPid) {
        this.bBillPid = bBillPid;
    }

    public Byte getbBillType() {
        return bBillType;
    }

    public void setbBillType(Byte bBillType) {
        this.bBillType = bBillType;
    }

    public Long getbSalerCompanyId() {
        return bSalerCompanyId;
    }

    public void setbSalerCompanyId(Long bSalerCompanyId) {
        this.bSalerCompanyId = bSalerCompanyId;
    }

    public String getbSalerCompanyName() {
        return bSalerCompanyName;
    }

    public void setbSalerCompanyName(String bSalerCompanyName) {
        this.bSalerCompanyName = bSalerCompanyName;
    }

}