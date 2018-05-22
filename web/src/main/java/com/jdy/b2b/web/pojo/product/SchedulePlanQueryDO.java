package com.jdy.b2b.web.pojo.product;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by yangcheng on 2018/2/7.
 */
public class SchedulePlanQueryDO {
    //基本数据
    private Long scheduleId;
    private Long costingTitleId;

    private String groupOrderNo;
    private String productName;
    @JsonFormat(pattern = "yyyy-MM-dd",timezone = "GMT+8")
    private LocalDate calendar;
    private Integer peopleNum;
    private BigDecimal systemIncome;
    private String stringhSystemIncome;

    private BigDecimal expendSum;
    private String stringExpendSum;

    private String stringGrossProfit;
    private String grossRate;
    private String comment;

    private List<SchedulePlanCateExpendDO> list = new ArrayList<>();

    public Long getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(Long scheduleId) {
        this.scheduleId = scheduleId;
    }

    public Long getCostingTitleId() {
        return costingTitleId;
    }

    public void setCostingTitleId(Long costingTitleId) {
        this.costingTitleId = costingTitleId;
    }

    public String getGroupOrderNo() {
        return groupOrderNo;
    }

    public void setGroupOrderNo(String groupOrderNo) {
        this.groupOrderNo = groupOrderNo;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public LocalDate getCalendar() {
        return calendar;
    }

    public void setCalendar(LocalDate calendar) {
        this.calendar = calendar;
    }

    public Integer getPeopleNum() {
        return peopleNum;
    }

    public void setPeopleNum(Integer peopleNum) {
        this.peopleNum = peopleNum;
    }


    public BigDecimal getExpendSum() {
        return expendSum;
    }

    public void setExpendSum(BigDecimal expendSum) {
        this.expendSum = expendSum;
    }

    public String getStringExpendSum() {
        return stringExpendSum;
    }

    public void setStringExpendSum(String stringExpendSum) {
        this.stringExpendSum = stringExpendSum;
    }

    public String getStringGrossProfit() {
        return stringGrossProfit;
    }

    public void setStringGrossProfit(String stringGrossProfit) {
        this.stringGrossProfit = stringGrossProfit;
    }

    public String getGrossRate() {
        return grossRate;
    }

    public void setGrossRate(String grossRate) {
        this.grossRate = grossRate;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public List<SchedulePlanCateExpendDO> getList() {
        return list;
    }

    public void setList(List<SchedulePlanCateExpendDO> list) {
        this.list = list;
    }

    public BigDecimal getSystemIncome() {
        return systemIncome;
    }

    public void setSystemIncome(BigDecimal systemIncome) {
        this.systemIncome = systemIncome;
    }

    public String getStringhSystemIncome() {
        return stringhSystemIncome;
    }

    public void setStringhSystemIncome(String stringhSystemIncome) {
        this.stringhSystemIncome = stringhSystemIncome;
    }
}
