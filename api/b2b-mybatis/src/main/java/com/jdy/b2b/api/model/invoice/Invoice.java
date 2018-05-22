package com.jdy.b2b.api.model.invoice;

import java.math.BigDecimal;
import java.util.Date;

public class Invoice {
    private Long id;

    private String iSupplierName;

    private String iInvoiceTitle;

    private BigDecimal iAmount;

    private Integer iType;

    private String iInvoiceNo;

    private Integer iReceiveMethod;

    private String iAddress;

    private String iSupplierContacts;

    private String iSupplierPhone;
    private String iBuyContacts;

    private String iBuyPhone;


    private String iApplyRemark;

    private String iHandleRemark;

    private String iRevokeReason;

    private String iExpressCompany;

    private String iExpressNo;

    private Integer iExpressMethod;

    private BigDecimal iExpressAmount;

    private Integer iStatus;

    private Date createTime;

    private Long createUser;

    private Date updateTime;

    private Long updateUser;


    private Long iSupplierId;
    private Long iBuyerId;
    private String createName;
    private String updateName;



    public String getUpdateName() {
        return updateName;
    }

    public void setUpdateName(String updateName) {
        this.updateName = updateName;
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

    public String getCreateName() {
        return createName;
    }

    public void setCreateName(String createName) {
        this.createName = createName;
    }

    public String getiBuyContacts() {
        return iBuyContacts;
    }

    public void setiBuyContacts(String iBuyContacts) {
        this.iBuyContacts = iBuyContacts;
    }

    public String getiBuyPhone() {
        return iBuyPhone;
    }

    public void setiBuyPhone(String iBuyPhone) {
        this.iBuyPhone = iBuyPhone;
    }

    public String getiRevokeReason() {
        return iRevokeReason;
    }

    public void setiRevokeReason(String iRevokeReason) {
        this.iRevokeReason = iRevokeReason;
    }

    public Integer getiStatus() {
        return iStatus;
    }

    public void setiStatus(Integer iStatus) {
        this.iStatus = iStatus;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getiSupplierName() {
        return iSupplierName;
    }

    public void setiSupplierName(String iSupplierName) {
        this.iSupplierName = iSupplierName == null ? null : iSupplierName.trim();
    }

    public String getiInvoiceTitle() {
        return iInvoiceTitle;
    }

    public void setiInvoiceTitle(String iInvoiceTitle) {
        this.iInvoiceTitle = iInvoiceTitle == null ? null : iInvoiceTitle.trim();
    }

    public BigDecimal getiAmount() {
        return iAmount;
    }

    public void setiAmount(BigDecimal iAmount) {
        this.iAmount = iAmount;
    }

    public Integer getiType() {
        return iType;
    }

    public void setiType(Integer iType) {
        this.iType = iType;
    }

    public String getiInvoiceNo() {
        return iInvoiceNo;
    }

    public void setiInvoiceNo(String iInvoiceNo) {
        this.iInvoiceNo = iInvoiceNo == null ? null : iInvoiceNo.trim();
    }

    public Integer getiReceiveMethod() {
        return iReceiveMethod;
    }

    public void setiReceiveMethod(Integer iReceiveMethod) {
        this.iReceiveMethod = iReceiveMethod;
    }

    public String getiAddress() {
        return iAddress;
    }

    public void setiAddress(String iAddress) {
        this.iAddress = iAddress == null ? null : iAddress.trim();
    }

    public String getiSupplierContacts() {
        return iSupplierContacts;
    }

    public void setiSupplierContacts(String iSupplierContacts) {
        this.iSupplierContacts = iSupplierContacts == null ? null : iSupplierContacts.trim();
    }

    public String getiSupplierPhone() {
        return iSupplierPhone;
    }

    public void setiSupplierPhone(String iSupplierPhone) {
        this.iSupplierPhone = iSupplierPhone == null ? null : iSupplierPhone.trim();
    }

    public String getiApplyRemark() {
        return iApplyRemark;
    }

    public void setiApplyRemark(String iApplyRemark) {
        this.iApplyRemark = iApplyRemark == null ? null : iApplyRemark.trim();
    }

    public String getiHandleRemark() {
        return iHandleRemark;
    }

    public void setiHandleRemark(String iHandleRemark) {
        this.iHandleRemark = iHandleRemark == null ? null : iHandleRemark.trim();
    }

    public String getiExpressCompany() {
        return iExpressCompany;
    }

    public void setiExpressCompany(String iExpressCompany) {
        this.iExpressCompany = iExpressCompany == null ? null : iExpressCompany.trim();
    }

    public String getiExpressNo() {
        return iExpressNo;
    }

    public void setiExpressNo(String iExpressNo) {
        this.iExpressNo = iExpressNo == null ? null : iExpressNo.trim();
    }

    public Integer getiExpressMethod() {
        return iExpressMethod;
    }

    public void setiExpressMethod(Integer iExpressMethod) {
        this.iExpressMethod = iExpressMethod;
    }

    public BigDecimal getiExpressAmount() {
        return iExpressAmount;
    }

    public void setiExpressAmount(BigDecimal iExpressAmount) {
        this.iExpressAmount = iExpressAmount;
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