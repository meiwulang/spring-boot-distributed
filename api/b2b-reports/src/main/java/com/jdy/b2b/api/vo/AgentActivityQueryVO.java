package com.jdy.b2b.api.vo;

import com.jdy.b2b.api.common.BaseVO;

import java.util.Date;

/**
 * 代理人活跃度查询VO
 * @author chris
 * @since Jan 07.18
 */
public class AgentActivityQueryVO extends BaseVO{
    /**
     * 查询月份
     * 格式：201801
     */
    private String queryMonth;

    private Integer companyId;

    private Integer deptId;

    private Integer salesManagerId;

    private Integer userId;

    public String getQueryMonth() {
        return queryMonth;
    }

    public void setQueryMonth(String queryMonth) {
        this.queryMonth = queryMonth;
    }

    public Integer getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Integer companyId) {
        this.companyId = companyId;
    }

    public Integer getDeptId() {
        return deptId;
    }

    public void setDeptId(Integer deptId) {
        this.deptId = deptId;
    }

    public Integer getSalesManagerId() {
        return salesManagerId;
    }

    public void setSalesManagerId(Integer salesManagerId) {
        this.salesManagerId = salesManagerId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }
}
