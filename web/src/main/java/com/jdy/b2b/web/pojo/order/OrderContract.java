package com.jdy.b2b.web.pojo.order;

import java.util.Date;

/**
 * Created by ASUS on 2017/12/14.
 */
public class OrderContract {
    public String signName;

    public String getSignName() {
        return signName;
    }

    public void setSignName(String signName) {
        this.signName = signName;
    }

    private Long id;

    private String orderNo;

    private String contractNo;

    private String templateNo;

    private String viewPdfUrl;

    private String downloadUrl;

    private String customerCaNo;

    private Byte isCompanySigin;

    private String companyAutoSignContractTransitionNo;

    private Byte isCustomerSign;

    private String customerSignContractTransitionNo;

    private Date createTime;

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

    public String getCustomerCaNo() {
        return customerCaNo;
    }

    public void setCustomerCaNo(String customerCaNo) {
        this.customerCaNo = customerCaNo == null ? null : customerCaNo.trim();
    }

    public Byte getIsCompanySigin() {
        return isCompanySigin;
    }

    public void setIsCompanySigin(Byte isCompanySigin) {
        this.isCompanySigin = isCompanySigin;
    }

    public String getCompanyAutoSignContractTransitionNo() {
        return companyAutoSignContractTransitionNo;
    }

    public void setCompanyAutoSignContractTransitionNo(String companyAutoSignContractTransitionNo) {
        this.companyAutoSignContractTransitionNo = companyAutoSignContractTransitionNo == null ? null : companyAutoSignContractTransitionNo.trim();
    }

    public Byte getIsCustomerSign() {
        return isCustomerSign;
    }

    public void setIsCustomerSign(Byte isCustomerSign) {
        this.isCustomerSign = isCustomerSign;
    }

    public String getCustomerSignContractTransitionNo() {
        return customerSignContractTransitionNo;
    }

    public void setCustomerSignContractTransitionNo(String customerSignContractTransitionNo) {
        this.customerSignContractTransitionNo = customerSignContractTransitionNo == null ? null : customerSignContractTransitionNo.trim();
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
