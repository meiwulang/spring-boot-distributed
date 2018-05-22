package com.jdy.b2b.web.pojo.reports;

import java.math.BigDecimal;

/**
 * Created by yangcheng on 2017/9/11.
 */
public class PayMethodResultDO{
    private String cGroup;
    private BigDecimal onlineTotal;
    private Integer onlineCounts;
    private BigDecimal creditTotal;
    private Integer creditCounts;
    private BigDecimal offlineTotal;
    private Integer offlineCounts;
    private BigDecimal unconfirmedTotal;
    private Integer unconfirmedCounts;
    private BigDecimal unPayedTotal;
    private Integer unPayedCounts;
    private BigDecimal Total;
    private Integer counts;

    public String getcGroup() {
        return cGroup;
    }

    public void setcGroup(String cGroup) {
        this.cGroup = cGroup;
    }

    public BigDecimal getOnlineTotal() {
        return onlineTotal;
    }

    public void setOnlineTotal(BigDecimal onlineTotal) {
        this.onlineTotal = onlineTotal;
    }

    public Integer getOnlineCounts() {
        return onlineCounts;
    }

    public void setOnlineCounts(Integer onlineCounts) {
        this.onlineCounts = onlineCounts;
    }

    public BigDecimal getCreditTotal() {
        return creditTotal;
    }

    public void setCreditTotal(BigDecimal creditTotal) {
        this.creditTotal = creditTotal;
    }

    public Integer getCreditCounts() {
        return creditCounts;
    }

    public void setCreditCounts(Integer creditCounts) {
        this.creditCounts = creditCounts;
    }

    public BigDecimal getOfflineTotal() {
        return offlineTotal;
    }

    public void setOfflineTotal(BigDecimal offlineTotal) {
        this.offlineTotal = offlineTotal;
    }

    public Integer getOfflineCounts() {
        return offlineCounts;
    }

    public void setOfflineCounts(Integer offlineCounts) {
        this.offlineCounts = offlineCounts;
    }

    public BigDecimal getUnconfirmedTotal() {
        return unconfirmedTotal;
    }

    public void setUnconfirmedTotal(BigDecimal unconfirmedTotal) {
        this.unconfirmedTotal = unconfirmedTotal;
    }

    public BigDecimal getUnPayedTotal() {
        return unPayedTotal;
    }

    public void setUnPayedTotal(BigDecimal unPayedTotal) {
        this.unPayedTotal = unPayedTotal;
    }

    public Integer getUnPayedCounts() {
        return unPayedCounts;
    }

    public void setUnPayedCounts(Integer unPayedCounts) {
        this.unPayedCounts = unPayedCounts;
    }

    public Integer getUnconfirmedCounts() {
        return unconfirmedCounts;
    }

    public void setUnconfirmedCounts(Integer unconfirmedCounts) {
        this.unconfirmedCounts = unconfirmedCounts;
    }

    public BigDecimal getTotal() {
        return Total;
    }

    public void setTotal(BigDecimal total) {
        Total = total;
    }

    public Integer getCounts() {
        return counts;
    }

    public void setCounts(Integer counts) {
        this.counts = counts;
    }
}
