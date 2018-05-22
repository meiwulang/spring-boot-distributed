package com.jdy.b2b.api.model.reports;

import com.jdy.b2b.api.common.BaseVO;

/**
 * Created by yangcheng on 2017/11/10.
 */
public class AgentDevelopChartQueryVo extends BaseVO {
    private Long companyId;
    private Long departId;  //假如选择部门
    private Long userId;   //假如选择部门中某一个人

    private String startDate;  //起始日期
    private String endDate;   //截止日期的后一天

    //    日 2   周 3    月 1     季 4     年 5
    private Integer queryType;

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public Long getDepartId() {
        return departId;
    }

    public void setDepartId(Long departId) {
        this.departId = departId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public Integer getQueryType() {
        return queryType;
    }

    public void setQueryType(Integer queryType) {
        this.queryType = queryType;
    }
}
