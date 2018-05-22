package com.jdy.b2b.web.pojo.reports;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel
public class AgentDevelopChartQueryVo extends BaseVO {
    private Long companyId;
    @ApiModelProperty(value = "部门id 可不传")
    private Long departId;
    @ApiModelProperty(value = "销售经理id 可不传")
    private Long userId;   //假如选择部门中某一个人
    @ApiModelProperty(value = "起始日期")
    private String startDate;  //起始日期
    @ApiModelProperty(value = "截止日期")
    private String endDate;   //截止日期的后一天
    //    日 2   周 3    月 1     季 4     年 5
    @ApiModelProperty(value = "统计类型 日2,周3,月1,季4,年5",required = true)
    private Integer queryType;

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
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

    public Long getDepartId() {
        return departId;
    }

    public void setDepartId(Long departId) {
        this.departId = departId;
    }
}
