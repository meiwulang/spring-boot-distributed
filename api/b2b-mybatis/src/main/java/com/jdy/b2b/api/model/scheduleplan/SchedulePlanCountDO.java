package com.jdy.b2b.api.model.scheduleplan;

/**
 * Created by yangcheng on 2018/2/7.
 */
public class SchedulePlanCountDO {
    private Integer peopleNum;
    private String stringSystemIncome;
    private String stringExpendSum;
    private String stringGrossProfit;
    private String grossRate;

    public Integer getPeopleNum() {
        return peopleNum;
    }

    public void setPeopleNum(Integer peopleNum) {
        this.peopleNum = peopleNum;
    }

    public String getStringSystemIncome() {
        return stringSystemIncome;
    }

    public void setStringSystemIncome(String stringSystemIncome) {
        this.stringSystemIncome = stringSystemIncome;
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
}
