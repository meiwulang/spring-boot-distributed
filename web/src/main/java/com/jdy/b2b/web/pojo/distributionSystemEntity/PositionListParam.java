package com.jdy.b2b.web.pojo.distributionSystemEntity;

import java.io.Serializable;

/**
 * Created by dugq on 2018/3/25.
 */
public class PositionListParam implements Serializable{
    private static final long serialVersionUID = 4215883402234893521L;

    private String searchParam;

    private Integer pageIndex;

    private Long companyId;

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getSearchParam() {
        return searchParam;
    }

    public void setSearchParam(String searchParam) {
        this.searchParam = searchParam;
    }

    public Integer getPageIndex() {
        return pageIndex;
    }

    public void setPageIndex(Integer pageIndex) {
        this.pageIndex = pageIndex;
    }
}
