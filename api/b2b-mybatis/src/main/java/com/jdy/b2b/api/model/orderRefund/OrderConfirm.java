package com.jdy.b2b.api.model.orderRefund;

import com.jdy.b2b.api.model.Order;

/**
 * Created by dugq on 2017/12/19.
 */
public class OrderConfirm extends Order {
    private Byte status;
    private Long contractId;

    public Byte getStatus() {
        return status;
    }

    public void setStatus(Byte status) {
        this.status = status;
    }

    public Long getContractId() {
        return contractId;
    }

    public void setContractId(Long contractId) {
        this.contractId = contractId;
    }
}
