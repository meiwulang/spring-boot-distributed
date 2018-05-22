package com.jdy.b2b.web.pojo.alterTicket;

import java.util.List;

/**
 * Created by strict on 2018/4/20.
 */
public class OrderAlterTicketWithTouristDTO extends OrderAlterTicketRecord{

    private String oldOrderNo; //原订单号

    private String oldGroupNo; //原团号

    private String newOrderNo; //现订单号

    private List<OrderAlterTicketTouristRecord> touristInfo;

    public String getOldOrderNo() {
        return oldOrderNo;
    }

    public void setOldOrderNo(String oldOrderNo) {
        this.oldOrderNo = oldOrderNo;
    }

    public String getOldGroupNo() {
        return oldGroupNo;
    }

    public void setOldGroupNo(String oldGroupNo) {
        this.oldGroupNo = oldGroupNo;
    }

    public String getNewOrderNo() {
        return newOrderNo;
    }

    public void setNewOrderNo(String newOrderNo) {
        this.newOrderNo = newOrderNo;
    }

    public List<OrderAlterTicketTouristRecord> getTouristInfo() {
        return touristInfo;
    }

    public void setTouristInfo(List<OrderAlterTicketTouristRecord> touristInfo) {
        this.touristInfo = touristInfo;
    }
}
