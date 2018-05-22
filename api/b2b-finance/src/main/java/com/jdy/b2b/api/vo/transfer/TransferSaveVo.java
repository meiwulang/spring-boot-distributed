package com.jdy.b2b.api.vo.transfer;

import com.jdy.b2b.api.common.BaseVO;

import java.math.BigDecimal;
import java.util.Date;

public class TransferSaveVo extends BaseVO{

    private Long tOutAccountId;

    private String tOutAccount;

    private Long tInAccountId;

    private String tInAccount;

    private Integer tTransferType;

    private BigDecimal tTransferAmount;

    private String tOrderNo;

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
        this.tOutAccount = tOutAccount;
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
        this.tInAccount = tInAccount;
    }

    public Integer gettTransferType() {
        return tTransferType;
    }

    public void settTransferType(Integer tTransferType) {
        this.tTransferType = tTransferType;
    }

    public BigDecimal gettTransferAmount() {
        return tTransferAmount;
    }

    public void settTransferAmount(BigDecimal tTransferAmount) {
        this.tTransferAmount = tTransferAmount;
    }

    public String gettOrderNo() {
        return tOrderNo;
    }

    public void settOrderNo(String tOrderNo) {
        this.tOrderNo = tOrderNo;
    }
}