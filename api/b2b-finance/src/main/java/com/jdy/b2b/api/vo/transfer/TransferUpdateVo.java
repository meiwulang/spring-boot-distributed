package com.jdy.b2b.api.vo.transfer;

import com.jdy.b2b.api.common.BaseVO;

import java.math.BigDecimal;
import java.util.Date;

public class TransferUpdateVo extends BaseVO{
    private Long id;

    private String tFailReason;

    private Date tTransferTime;

    private Date tConfrimTime;

    private Integer tStatus;

    public String gettFailReason() {
        return tFailReason;
    }

    public void settFailReason(String tFailReason) {
        this.tFailReason = tFailReason;
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

    public Integer gettStatus() {
        return tStatus;
    }

    public void settStatus(Integer tStatus) {
        this.tStatus = tStatus;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}