package com.jdy.b2b.api.model.scheduleplan;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by yangcheng on 2017/12/6.
 */
public class CurrentPageTotalDO {
    //每页统计
    private Integer pageReserve;
    private Integer pagePayed;
    private Map<Long,Long> map = new HashMap<>();  //票id--游客数量对应
    private Integer pageTotalNums;

    public Map<Long, Long> getMap() {
        return map;
    }

    public void setMap(Map<Long, Long> map) {
        this.map = map;
    }

    public Integer getPageReserve() {
        return pageReserve;
    }

    public void setPageReserve(Integer pageReserve) {
        this.pageReserve = pageReserve;
    }

    public Integer getPagePayed() {
        return pagePayed;
    }

    public void setPagePayed(Integer pagePayed) {
        this.pagePayed = pagePayed;
    }

    public Integer getPageTotalNums() {
        return pageTotalNums;
    }

    public void setPageTotalNums(Integer pageTotalNums) {
        this.pageTotalNums = pageTotalNums;
    }
}
