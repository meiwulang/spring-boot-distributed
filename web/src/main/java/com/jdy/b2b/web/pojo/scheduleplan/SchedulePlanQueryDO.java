package com.jdy.b2b.web.pojo.scheduleplan;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by yangcheng on 2018/2/7.
 */
@ApiModel("出团计划表查询返回结果")
public class SchedulePlanQueryDO{
    @ApiModelProperty(value = "班期id")
    private Long scheduleId;
    @ApiModelProperty(value = "团期id")
    private Long costingTitleId;
    @ApiModelProperty("团号")
    private String groupOrderNo;
    @ApiModelProperty("产品名称")
    private String productName;
    @ApiModelProperty("出团日期")
    @JsonFormat(pattern = "yyyy-MM-dd",timezone = "GMT+8")
    private LocalDate calendar;
    @ApiModelProperty("人数")
    private Integer peopleNum;
    @ApiModelProperty("系统收入")
    private BigDecimal systemIncome;
    @ApiModelProperty("支出合计")
    private BigDecimal expendSum;
    @ApiModelProperty("毛利")
    private BigDecimal grossProfit;
    @ApiModelProperty("毛利率")
    private String grossRate;
    @ApiModelProperty("备注")
    private String comment;

    @ApiModelProperty("分类收入集合")
    private Map<Long,BigDecimal> cateMap = new HashMap<>();

    public Long getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(Long scheduleId) {
        this.scheduleId = scheduleId;
    }

    public Long getCostingTitleId() {
        return costingTitleId;
    }

    public void setCostingTitleId(Long costingTitleId) {
        this.costingTitleId = costingTitleId;
    }

    public String getGroupOrderNo() {
        return groupOrderNo;
    }

    public void setGroupOrderNo(String groupOrderNo) {
        this.groupOrderNo = groupOrderNo;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public LocalDate getCalendar() {
        return calendar;
    }

    public void setCalendar(LocalDate calendar) {
        this.calendar = calendar;
    }

    public Integer getPeopleNum() {
        return peopleNum;
    }

    public void setPeopleNum(Integer peopleNum) {
        this.peopleNum = peopleNum;
    }

    public BigDecimal getSystemIncome() {
        return systemIncome;
    }

    public void setSystemIncome(BigDecimal systemIncome) {
        this.systemIncome = systemIncome;
    }

    public Map<Long, BigDecimal> getCateMap() {
        return cateMap;
    }

    public void setCateMap(Map<Long, BigDecimal> cateMap) {
        this.cateMap = cateMap;
    }

    public BigDecimal getExpendSum() {
        return expendSum;
    }

    public void setExpendSum(BigDecimal expendSum) {
        this.expendSum = expendSum;
    }

    public BigDecimal getGrossProfit() {
        return grossProfit;
    }

    public void setGrossProfit(BigDecimal grossProfit) {
        this.grossProfit = grossProfit;
    }

    public String getGrossRate() {
        return grossRate;
    }

    public void setGrossRate(String grossRate) {
        this.grossRate = grossRate;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
