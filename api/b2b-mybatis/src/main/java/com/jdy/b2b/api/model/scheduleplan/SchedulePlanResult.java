package com.jdy.b2b.api.model.scheduleplan;

import com.github.pagehelper.PageInfo;

/**
 * Created by yangcheng on 2017/12/5.
 */
public class SchedulePlanResult {
    private PageInfo<SchedulePlan> pageInfo;
    private PageInfo pageTotalInfo;
    private PageInfo totalInfo;

    public PageInfo<SchedulePlan> getPageInfo() {
        return pageInfo;
    }

    public void setPageInfo(PageInfo<SchedulePlan> pageInfo) {
        this.pageInfo = pageInfo;
    }

    public PageInfo getPageTotalInfo() {
        return pageTotalInfo;
    }

    public void setPageTotalInfo(PageInfo pageTotalInfo) {
        this.pageTotalInfo = pageTotalInfo;
    }

    public PageInfo getTotalInfo() {
        return totalInfo;
    }

    public void setTotalInfo(PageInfo totalInfo) {
        this.totalInfo = totalInfo;
    }
}
