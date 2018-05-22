package com.jdy.b2b.api.model.scheduleplan;

import java.util.List;

/**
 * Created by yangcheng on 2017/12/5.
 */
public class SchedulePlan {
    private String dateStr;
    private SinglePayedSchedulePlan payPlan;
    private SingleReserveSchedulePlan reservePlan;

    public String getDateStr() {
        return dateStr;
    }

    public void setDateStr(String dateStr) {
        this.dateStr = dateStr;
    }

    public SinglePayedSchedulePlan getPayPlan() {
        return payPlan;
    }

    public void setPayPlan(SinglePayedSchedulePlan payPlan) {
        this.payPlan = payPlan;
    }

    public SingleReserveSchedulePlan getReservePlan() {
        return reservePlan;
    }

    public void setReservePlan(SingleReserveSchedulePlan reservePlan) {
        this.reservePlan = reservePlan;
    }
}
