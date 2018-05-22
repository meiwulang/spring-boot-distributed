package com.jdy.b2b.api.model.electroniccontract;

/**
 * Created by zhangfofa on 2017/12/14.
 */
public class SignContract {

    private String orderNo;

    private String contractNo;

    private String docTitle;

    public String getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(String orderNo) {
        this.orderNo = orderNo;
    }

    public String getContractNo() {
        return contractNo;
    }

    public void setContractNo(String contractNo) {
        this.contractNo = contractNo;
    }

    public String getDocTitle() {
        return docTitle;
    }

    public void setDocTitle(String docTitle) {
        this.docTitle = docTitle;
    }
}
