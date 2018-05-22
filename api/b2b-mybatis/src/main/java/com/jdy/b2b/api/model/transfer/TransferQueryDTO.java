package com.jdy.b2b.api.model.transfer;

import java.util.Date;

public class TransferQueryDTO{
    private Integer tTransferType;
    private Integer tStatus;

    private Date minTransferTime;

    private Date maxTransferTime;

    private String searchStr;

    public Integer gettTransferType() {
        return tTransferType;
    }

    public void settTransferType(Integer tTransferType) {
        this.tTransferType = tTransferType;
    }

    public Integer gettStatus() {
        return tStatus;
    }

    public void settStatus(Integer tStatus) {
        this.tStatus = tStatus;
    }

    public Date getMinTransferTime() {
        return minTransferTime;
    }

    public void setMinTransferTime(Date minTransferTime) {
        this.minTransferTime = minTransferTime;
    }

    public Date getMaxTransferTime() {
        return maxTransferTime;
    }

    public void setMaxTransferTime(Date maxTransferTime) {
        this.maxTransferTime = maxTransferTime;
    }

    public String getSearchStr() {
        return searchStr;
    }

    public void setSearchStr(String searchStr) {
        this.searchStr = searchStr;
    }
}