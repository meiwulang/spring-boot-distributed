package com.jdy.b2b.api.vo.invoice;

import com.jdy.b2b.api.common.BaseVO;

import java.math.BigDecimal;
import java.util.Date;

public class InvoiceQueryVo extends BaseVO{

    private Integer iStatus;

    private Long iSupplierId;

    private Long iBuyerId;

    private Date minCreateTime;
    private Date maxCreateTime;
    private Date minUpdateTime;
    private Date maxUpdateTime;

    private String searchStr;

    public Integer getiStatus() {
        return iStatus;
    }

    public void setiStatus(Integer iStatus) {
        this.iStatus = iStatus;
    }

    public Long getiSupplierId() {
        return iSupplierId;
    }

    public void setiSupplierId(Long iSupplierId) {
        this.iSupplierId = iSupplierId;
    }

    public Long getiBuyerId() {
        return iBuyerId;
    }

    public void setiBuyerId(Long iBuyerId) {
        this.iBuyerId = iBuyerId;
    }

    public Date getMinCreateTime() {
        return minCreateTime;
    }

    public void setMinCreateTime(Date minCreateTime) {
        this.minCreateTime = minCreateTime;
    }

    public Date getMaxCreateTime() {
        return maxCreateTime;
    }

    public void setMaxCreateTime(Date maxCreateTime) {
        this.maxCreateTime = maxCreateTime;
    }

    public Date getMinUpdateTime() {
        return minUpdateTime;
    }

    public void setMinUpdateTime(Date minUpdateTime) {
        this.minUpdateTime = minUpdateTime;
    }

    public Date getMaxUpdateTime() {
        return maxUpdateTime;
    }

    public void setMaxUpdateTime(Date maxUpdateTime) {
        this.maxUpdateTime = maxUpdateTime;
    }

    public String getSearchStr() {
        return searchStr;
    }

    public void setSearchStr(String searchStr) {
        this.searchStr = searchStr;
    }
}