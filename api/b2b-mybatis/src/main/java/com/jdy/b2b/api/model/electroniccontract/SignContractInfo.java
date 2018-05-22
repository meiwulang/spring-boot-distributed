package com.jdy.b2b.api.model.electroniccontract;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

public class SignContractInfo {
    private Long id;

    private String orderNo;

    private String contractNo;

    private String templateNo;

    private String viewPdfUrl;

    private String downloadUrl;

    private Byte isCompanySigin;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date companySignContractTime;

    private String companySignContractTransitionNo;

    private Byte isCustomerSign;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date customerSignContractTime;

    private String customerSignContractTransitionNo;

    private String customerCaNo;

    private Byte status;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updateTime;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(String orderNo) {
        this.orderNo = orderNo == null ? null : orderNo.trim();
    }

    public String getContractNo() {
        return contractNo;
    }

    public void setContractNo(String contractNo) {
        this.contractNo = contractNo == null ? null : contractNo.trim();
    }

    public String getTemplateNo() {
        return templateNo;
    }

    public void setTemplateNo(String templateNo) {
        this.templateNo = templateNo == null ? null : templateNo.trim();
    }

    public String getViewPdfUrl() {
        return viewPdfUrl;
    }

    public void setViewPdfUrl(String viewPdfUrl) {
        this.viewPdfUrl = viewPdfUrl == null ? null : viewPdfUrl.trim();
    }

    public String getDownloadUrl() {
        return downloadUrl;
    }

    public void setDownloadUrl(String downloadUrl) {
        this.downloadUrl = downloadUrl == null ? null : downloadUrl.trim();
    }

    public Byte getIsCompanySigin() {
        return isCompanySigin;
    }

    public void setIsCompanySigin(Byte isCompanySigin) {
        this.isCompanySigin = isCompanySigin;
    }

    public Date getCompanySignContractTime() {
        return companySignContractTime;
    }

    public void setCompanySignContractTime(Date companySignContractTime) {
        this.companySignContractTime = companySignContractTime;
    }

    public String getCompanySignContractTransitionNo() {
        return companySignContractTransitionNo;
    }

    public void setCompanySignContractTransitionNo(String companySignContractTransitionNo) {
        this.companySignContractTransitionNo = companySignContractTransitionNo == null ? null : companySignContractTransitionNo.trim();
    }

    public Byte getIsCustomerSign() {
        return isCustomerSign;
    }

    public void setIsCustomerSign(Byte isCustomerSign) {
        this.isCustomerSign = isCustomerSign;
    }

    public Date getCustomerSignContractTime() {
        return customerSignContractTime;
    }

    public void setCustomerSignContractTime(Date customerSignContractTime) {
        this.customerSignContractTime = customerSignContractTime;
    }

    public String getCustomerSignContractTransitionNo() {
        return customerSignContractTransitionNo;
    }

    public void setCustomerSignContractTransitionNo(String customerSignContractTransitionNo) {
        this.customerSignContractTransitionNo = customerSignContractTransitionNo == null ? null : customerSignContractTransitionNo.trim();
    }

    public String getCustomerCaNo() {
        return customerCaNo;
    }

    public void setCustomerCaNo(String customerCaNo) {
        this.customerCaNo = customerCaNo == null ? null : customerCaNo.trim();
    }

    public Byte getStatus() {
        return status;
    }

    public void setStatus(Byte status) {
        this.status = status;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }
}