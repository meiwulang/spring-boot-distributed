package com.jdy.b2b.api.model.scheduleplan;

import com.github.pagehelper.PageInfo;

/**
 * Created by yangcheng on 2017/12/5.
 */
public class SchedulePlanManageResult {
    private PageInfo<SchedulePlanManage> pageInfo;
    private PageInfo<CurrentPageTotalDO> pageTotalInfo;
    private PageInfo<TotalPageDO> totalInfo;

    public PageInfo<SchedulePlanManage> getPageInfo() {
        return pageInfo;
    }

    public void setPageInfo(PageInfo<SchedulePlanManage> pageInfo) {
        this.pageInfo = pageInfo;
    }

    public PageInfo<CurrentPageTotalDO> getPageTotalInfo() {
        return pageTotalInfo;
    }

    public void setPageTotalInfo(PageInfo<CurrentPageTotalDO> pageTotalInfo) {
        this.pageTotalInfo = pageTotalInfo;
    }

    public PageInfo<TotalPageDO> getTotalInfo() {
        return totalInfo;
    }

    public void setTotalInfo(PageInfo<TotalPageDO> totalInfo) {
        this.totalInfo = totalInfo;
    }
}
