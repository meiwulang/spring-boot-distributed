package com.jdy.b2b.api.model.scheduleplan;

/**
 * Created by yangcheng on 2017/12/5.
 */
public class SingleSchedulePlan {
    private Integer sName;
    private Integer reserveNum;
    private Integer payedNum;
    private Integer singleTotal;

    public Integer getSingleTotal() {
        return singleTotal;
    }

    public void setSingleTotal(Integer singleTotal) {
        this.singleTotal = singleTotal;
    }

    public Integer getsName() {
        return sName;
    }

    public void setsName(Integer sName) {
        this.sName = sName;
    }

    public Integer getReserveNum() {
        return reserveNum;
    }

    public void setReserveNum(Integer reserveNum) {
        this.reserveNum = reserveNum;
    }

    public Integer getPayedNum() {
        return payedNum;
    }

    public void setPayedNum(Integer payedNum) {
        this.payedNum = payedNum;
    }
}
