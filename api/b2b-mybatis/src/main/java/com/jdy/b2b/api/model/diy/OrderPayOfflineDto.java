package com.jdy.b2b.api.model.diy;

import java.math.BigDecimal;

/**
 * Created by dugq on 2018/1/24.
 */
public class OrderPayOfflineDto extends OrderPayLine {
    public OrderPayOfflineDto() {
        super(1);
    }

    private byte status;
    private String url;
    private BigDecimal money;

    private String moneyStr;
    private String statusStr;
    private String uploadDesc;

    public String getUploadDesc() {
        return uploadDesc;
    }

    public void setUploadDesc(String uploadDesc) {
        this.uploadDesc = uploadDesc;
    }

    public String getMoneyStr() {
        return moneyStr;
    }

    public void setMoneyStr(String moneyStr) {
        this.moneyStr = moneyStr;
    }

    public String getStatusStr() {
        return statusStr;
    }

    public void setStatusStr(String statusStr) {
        this.statusStr = statusStr;
    }

    public byte getStatus() {
        return status;
    }

    public void setStatus(byte status) {
        this.status = status;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public BigDecimal getMoney() {
        return money;
    }

    public void setMoney(BigDecimal money) {
        this.money = money;
    }
}
