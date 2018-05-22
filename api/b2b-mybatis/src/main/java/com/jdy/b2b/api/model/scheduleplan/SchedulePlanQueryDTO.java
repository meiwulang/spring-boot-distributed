package com.jdy.b2b.api.model.scheduleplan;

import com.jdy.b2b.api.common.BaseVO;

import java.time.LocalDate;

/**
 * Created by yangcheng on 2018/2/7.
 */
public class SchedulePlanQueryDTO extends BaseVO{
    private String searchStr;
    private Integer flag;
    private LocalDate beginDate;
    private LocalDate endDate;

    public String getSearchStr() {
        return searchStr;
    }

    public void setSearchStr(String searchStr) {
        this.searchStr = searchStr;
    }

    public Integer getFlag() {
        return flag;
    }

    public void setFlag(Integer flag) {
        this.flag = flag;
    }

    public LocalDate getBeginDate() {
        return beginDate;
    }

    public void setBeginDate(LocalDate beginDate) {
        this.beginDate = beginDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
}
