package com.jdy.b2b.api.model.diy;

import com.jdy.b2b.api.model.Schedule;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/18 10:21
 */
public class ScheduleQuery extends Schedule {
    /**
     * 查询开始时间,yyyy-MM-dd
     */
    private String sCalendarStart;

    /**
     * 查询结束时间,yyyy-MM-dd
     */
    private String sCalendarEnd;

    /*排序标记*/
    private Integer orderBy;

    /* 0:正常 1:暂停 2:删除 3:已过期 */
    private Integer flag;

    public Integer getFlag() {
        return flag;
    }

    public void setFlag(Integer flag) {
        this.flag = flag;
    }



    public String getsCalendarStart() {
        return sCalendarStart;
    }

    public void setsCalendarStart(String sCalendarStart) {
        this.sCalendarStart = sCalendarStart;
    }

    public String getsCalendarEnd() {
        return sCalendarEnd;
    }

    public void setsCalendarEnd(String sCalendarEnd) {
        this.sCalendarEnd = sCalendarEnd;
    }

    public Integer getOrderBy() {
        return orderBy;
    }

    public void setOrderBy(Integer orderBy) {
        this.orderBy = orderBy;
    }
}
