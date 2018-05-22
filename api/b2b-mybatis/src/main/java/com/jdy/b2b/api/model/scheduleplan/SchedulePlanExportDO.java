package com.jdy.b2b.api.model.scheduleplan;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;

/**
 * Created by yangcheng on 2017/12/6.
 */
public class SchedulePlanExportDO {
    private Long productId;
    private String pName;
    private Long tId;
    private String tName;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate sCalendar;
    private Integer flag;//0 预定 1:已付
    private Integer ticketCounts;//游客数
    private Integer oStatus;
    private Integer rowTag;

    public Integer getRowTag() {
        return rowTag;
    }

    public void setRowTag(Integer rowTag) {
        this.rowTag = rowTag;
    }

    public Integer getoStatus() {
        return oStatus;
    }

    public void setoStatus(Integer oStatus) {
        this.oStatus = oStatus;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Long gettId() {
        return tId;
    }

    public void settId(Long tId) {
        this.tId = tId;
    }

    public String getpName() {
        return pName;
    }

    public void setpName(String pName) {
        this.pName = pName;
    }

    public String gettName() {
        return tName;
    }

    public void settName(String tName) {
        this.tName = tName;
    }

    public LocalDate getsCalendar() {
        return sCalendar;
    }

    public void setsCalendar(LocalDate sCalendar) {
        this.sCalendar = sCalendar;
    }

    public Integer getFlag() {
        return flag;
    }

    public void setFlag(Integer flag) {
        this.flag = flag;
    }

    public Integer getTicketCounts() {
        return ticketCounts;
    }

    public void setTicketCounts(Integer ticketCounts) {
        this.ticketCounts = ticketCounts;
    }
}
