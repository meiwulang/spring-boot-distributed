package com.jdy.b2b.api.model.transfer;

import java.math.BigDecimal;
import java.util.Date;

public class Transfer {
    private Long id;

    private Long tOutAccountId;

    private String tOutAccount;

    private Long tInAccountId;

    private String tInAccount;

    private Integer tTransferType;

    private String tTransferNo;

    private BigDecimal tTransferAmount;

    private Date tStartTime;

    private Date tTransferTime;

    private String tFailReason;

    private Date tConfrimTime;

    private String tOrderNo;

    private Integer tStatus;

    private Date createTime;

    private Long createUser;

    private Date updateTime;

    private Long updateUser;

    public String gettFailReason() {
        return tFailReason;
    }

    public void settFailReason(String tFailReason) {
        this.tFailReason = tFailReason;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long gettOutAccountId() {
        return tOutAccountId;
    }

    public void settOutAccountId(Long tOutAccountId) {
        this.tOutAccountId = tOutAccountId;
    }

    public String gettOutAccount() {
        return tOutAccount;
    }

    public void settOutAccount(String tOutAccount) {
        this.tOutAccount = tOutAccount == null ? null : tOutAccount.trim();
    }

    public Long gettInAccountId() {
        return tInAccountId;
    }

    public void settInAccountId(Long tInAccountId) {
        this.tInAccountId = tInAccountId;
    }

    public String gettInAccount() {
        return tInAccount;
    }

    public void settInAccount(String tInAccount) {
        this.tInAccount = tInAccount == null ? null : tInAccount.trim();
    }

    public Integer gettTransferType() {
        return tTransferType;
    }

    public void settTransferType(Integer tTransferType) {
        this.tTransferType = tTransferType;
    }

    public String gettTransferNo() {
        return tTransferNo;
    }

    public void settTransferNo(String tTransferNo) {
        this.tTransferNo = tTransferNo == null ? null : tTransferNo.trim();
    }

    public BigDecimal gettTransferAmount() {
        return tTransferAmount;
    }

    public void settTransferAmount(BigDecimal tTransferAmount) {
        this.tTransferAmount = tTransferAmount;
    }

    public Date gettStartTime() {
        return tStartTime;
    }

    public void settStartTime(Date tStartTime) {
        this.tStartTime = tStartTime;
    }

    public Date gettTransferTime() {
        return tTransferTime;
    }

    public void settTransferTime(Date tTransferTime) {
        this.tTransferTime = tTransferTime;
    }

    public Date gettConfrimTime() {
        return tConfrimTime;
    }

    public void settConfrimTime(Date tConfrimTime) {
        this.tConfrimTime = tConfrimTime;
    }

    public String gettOrderNo() {
        return tOrderNo;
    }

    public void settOrderNo(String tOrderNo) {
        this.tOrderNo = tOrderNo == null ? null : tOrderNo.trim();
    }

    public Integer gettStatus() {
        return tStatus;
    }

    public void settStatus(Integer tStatus) {
        this.tStatus = tStatus;
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