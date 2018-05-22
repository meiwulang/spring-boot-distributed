package com.jdy.b2b.api.model.scheduleplan;

/**
 * Created by yangcheng on 2017/12/5.
 */
public class SchedulePlanManageCountDO {

    private Integer reserveNums;//预约人数合计
    private Integer payedNum;//付款人数合计
    private Integer totalNums;//合计
    private Integer flag;

    public Integer getFlag() {
        return flag;
    }

    public void setFlag(Integer flag) {
        this.flag = flag;
    }

    public Integer getReserveNums() {
        return reserveNums;
    }

    public void setReserveNums(Integer reserveNums) {
        this.reserveNums = reserveNums;
    }

    public Integer getPayedNum() {
        return payedNum;
    }

    public void setPayedNum(Integer payedNum) {
        this.payedNum = payedNum;
    }

    public Integer getTotalNums() {
        return totalNums;
    }

    public void setTotalNums(Integer totalNums) {
        this.totalNums = totalNums;
    }
}
