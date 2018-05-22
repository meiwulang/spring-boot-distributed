package com.jdy.b2b.api.model.withdrawals;

import java.math.BigDecimal;
import java.util.Date;

public class Withdrawals {
    private Long id;

    private String wBillNo;

    private Date wDay;

    private Long wInAccountId;

    private String wInAccount;

    private BigDecimal wBillAmount;

    private BigDecimal wSeviceCharge;

    private BigDecimal wInAmount;

    private Date wBillTime;

    private String wRemark;

    private Date createTime;

    private Long createUser;

    private Date updateTime;

    private Long updateUser;

    private Integer wStatus;

    private Date wWithdrawalsTime;

    public Integer getwStatus() {
        return wStatus;
    }

    public void setwStatus(Integer wStatus) {
        this.wStatus = wStatus;
    }

    public Date getwWithdrawalsTime() {
        return wWithdrawalsTime;
    }

    public void setwWithdrawalsTime(Date wWithdrawalsTime) {
        this.wWithdrawalsTime = wWithdrawalsTime;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getwBillNo() {
        return wBillNo;
    }

    public void setwBillNo(String wBillNo) {
        this.wBillNo = wBillNo == null ? null : wBillNo.trim();
    }

    public Date getwDay() {
        return wDay;
    }

    public void setwDay(Date wDay) {
        this.wDay = wDay;
    }

    public Long getwInAccountId() {
        return wInAccountId;
    }

    public void setwInAccountId(Long wInAccountId) {
        this.wInAccountId = wInAccountId;
    }

    public String getwInAccount() {
        return wInAccount;
    }

    public void setwInAccount(String wInAccount) {
        this.wInAccount = wInAccount == null ? null : wInAccount.trim();
    }

    public BigDecimal getwBillAmount() {
        return wBillAmount;
    }

    public void setwBillAmount(BigDecimal wBillAmount) {
        this.wBillAmount = wBillAmount;
    }

    public BigDecimal getwSeviceCharge() {
        return wSeviceCharge;
    }

    public void setwSeviceCharge(BigDecimal wSeviceCharge) {
        this.wSeviceCharge = wSeviceCharge;
    }

    public BigDecimal getwInAmount() {
        return wInAmount;
    }

    public void setwInAmount(BigDecimal wInAmount) {
        this.wInAmount = wInAmount;
    }

    public Date getwBillTime() {
        return wBillTime;
    }

    public void setwBillTime(Date wBillTime) {
        this.wBillTime = wBillTime;
    }

    public String getwRemark() {
        return wRemark;
    }

    public void setwRemark(String wRemark) {
        this.wRemark = wRemark == null ? null : wRemark.trim();
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