package com.jdy.b2b.web.pojo.electroniccontract;

/**
 * Created by zhangfofa on 2017/12/18.
 */
public class NotifyQueryDTO {

    private String orderNo;

    private String timeStamp;

    private String msgDigest;

    public String getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(String orderNo) {
        this.orderNo = orderNo;
    }

    public String getTimeStamp() {
        return timeStamp;
    }

    public void setTimeStamp(String timeStamp) {
        this.timeStamp = timeStamp;
    }

    public String getMsgDigest() {
        return msgDigest;
    }

    public void setMsgDigest(String msgDigest) {
        this.msgDigest = msgDigest;
    }

    @Override
    public String toString() {
        return "NotifyQueryDTO{" +
                "orderNo='" + orderNo + '\'' +
                ", timeStamp='" + timeStamp + '\'' +
                ", msgDigest='" + msgDigest + '\'' +
                '}';
    }
}
