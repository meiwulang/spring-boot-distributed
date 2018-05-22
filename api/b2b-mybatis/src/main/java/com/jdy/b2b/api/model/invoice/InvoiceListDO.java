package com.jdy.b2b.api.model.invoice;

import java.math.BigDecimal;
import java.util.Date;

public class InvoiceListDO {
    private Long id;

    private String iInvoiceTitle;

    private BigDecimal iAmount;

    private Integer iReceiveMethod;

    private String createName;

    private Date createTime;

    private String iBuyContacts;

    private String iInvoiceNo;
    private Integer iStatus;

    private String updateName;
    private Date updateTime;

    private String iHandleRemark;

    public String getiHandleRemark() {
        return iHandleRemark;
    }

    public void setiHandleRemark(String iHandleRemark) {
        this.iHandleRemark = iHandleRemark;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getiInvoiceTitle() {
        return iInvoiceTitle;
    }

    public void setiInvoiceTitle(String iInvoiceTitle) {
        this.iInvoiceTitle = iInvoiceTitle;
    }

    public BigDecimal getiAmount() {
        return iAmount;
    }

    public void setiAmount(BigDecimal iAmount) {
        this.iAmount = iAmount;
    }

    public Integer getiReceiveMethod() {
        return iReceiveMethod;
    }

    public void setiReceiveMethod(Integer iReceiveMethod) {
        this.iReceiveMethod = iReceiveMethod;
    }

    public String getiBuyContacts() {
        return iBuyContacts;
    }

    public void setiBuyContacts(String iBuyContacts) {
        this.iBuyContacts = iBuyContacts;
    }

    public String getiInvoiceNo() {
        return iInvoiceNo;
    }

    public void setiInvoiceNo(String iInvoiceNo) {
        this.iInvoiceNo = iInvoiceNo;
    }

    public Integer getiStatus() {
        return iStatus;
    }

    public void setiStatus(Integer iStatus) {
        this.iStatus = iStatus;
    }

    public String getCreateName() {
        return createName;
    }

    public void setCreateName(String createName) {
        this.createName = createName;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getUpdateName() {
        return updateName;
    }

    public void setUpdateName(String updateName) {
        this.updateName = updateName;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }
}