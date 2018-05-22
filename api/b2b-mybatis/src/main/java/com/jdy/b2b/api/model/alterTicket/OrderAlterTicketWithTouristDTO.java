package com.jdy.b2b.api.model.alterTicket;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;
import java.util.List;

/**
 * Created by strict on 2018/4/20.
 */
public class OrderAlterTicketWithTouristDTO extends OrderAlterTicketRecord{

    private String oldOrderNo; //原订单号

    private String oldGroupNo; //原团号

    private String newOrderNo; //现订单号

    private List<OrderAlterTicketTouristRecord> touristInfo;

    //================== 获取单条改签信息还需要的属性 start=======
    private String lineName;

    private Integer peopleNum;

    @JsonFormat(pattern = "yyyy/MM/dd",timezone = "GMT+8")
    private Date oldStartDate;
    @JsonFormat(pattern = "yyyy/MM/dd",timezone = "GMT+8")
    private Date newStartDate;

    //================== 获取单条改签信息还需要的属性 end=======

    public String getLineName() {
        return lineName;
    }

    public void setLineName(String lineName) {
        this.lineName = lineName;
    }

    public Integer getPeopleNum() {
        return peopleNum;
    }

    public void setPeopleNum(Integer peopleNum) {
        this.peopleNum = peopleNum;
    }

    public Date getOldStartDate() {
        return oldStartDate;
    }

    public void setOldStartDate(Date oldStartDate) {
        this.oldStartDate = oldStartDate;
    }

    public Date getNewStartDate() {
        return newStartDate;
    }

    public void setNewStartDate(Date newStartDate) {
        this.newStartDate = newStartDate;
    }

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
