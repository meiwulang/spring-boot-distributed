package com.jdy.b2b.api.model.invoice;

import com.jdy.b2b.api.model.Order;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class InvoiceInfoDO {
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

    private String iExpressCompany;

    private String iExpressNo;

    private Integer iExpressMethod;

    private BigDecimal iExpressAmount;

    private List<InvoiceOrderDO> orderList = new ArrayList<InvoiceOrderDO>();

    public List<InvoiceOrderDO> getOrderList() {
        return orderList;
    }

    public void setOrderList(List<InvoiceOrderDO> orderList) {
        this.orderList = orderList;
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

}