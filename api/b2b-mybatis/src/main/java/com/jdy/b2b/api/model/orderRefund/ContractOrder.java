package com.jdy.b2b.api.model.orderRefund;

/**
 * Created by dugq on 2017/12/19.
 */
public class ContractOrder {
    private Integer orderId;
    private Integer status;
    private String url;
    private Integer contractId;
    private String contractAgreement;

    public String getContractAgreement() {
        return contractAgreement;
    }

    public void setContractAgreement(String contractAgreement) {
        this.contractAgreement = contractAgreement;
    }

    public Integer getContractId() {
        return contractId;
    }

    public void setContractId(Integer contractId) {
        this.contractId = contractId;
    }

    public Integer getOrderId() {
        return orderId;
    }

    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
