package com.jdy.b2b.api.model.scheduleplan;

/**
 * Created by yangcheng on 2017/12/6.
 */
public class TotalPageDO {
    //全部统计
    private Integer totalReserve;
    private Integer totalPayed;
    private Integer totalNums;

    public Integer getTotalReserve() {
        return totalReserve;
    }

    public void setTotalReserve(Integer totalReserve) {
        this.totalReserve = totalReserve;
    }

    public Integer getTotalPayed() {
        return totalPayed;
    }

    public void setTotalPayed(Integer totalPayed) {
        this.totalPayed = totalPayed;
    }

    public Integer getTotalNums() {
        return totalNums;
    }

    public void setTotalNums(Integer totalNums) {
        this.totalNums = totalNums;
    }
}
