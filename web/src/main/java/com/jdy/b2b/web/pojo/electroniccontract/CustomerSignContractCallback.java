package com.jdy.b2b.web.pojo.electroniccontract;

/**
 * Created by zhangfofa on 2017/12/14.
 */
public class CustomerSignContractCallback {

    private String contractNo;

    private String downloadUrl;

    private String viewpdfUrl;

    public String getContractNo() {
        return contractNo;
    }

    public void setContractNo(String contractNo) {
        this.contractNo = contractNo;
    }

    public String getDownloadUrl() {
        return downloadUrl;
    }

    public void setDownloadUrl(String downloadUrl) {
        this.downloadUrl = downloadUrl;
    }

    public String getViewpdfUrl() {
        return viewpdfUrl;
    }

    public void setViewpdfUrl(String viewpdfUrl) {
        this.viewpdfUrl = viewpdfUrl;
    }
}
