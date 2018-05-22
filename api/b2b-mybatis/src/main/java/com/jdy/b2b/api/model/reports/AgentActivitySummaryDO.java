package com.jdy.b2b.api.model.reports;

import java.math.BigDecimal;
import java.math.MathContext;
import java.util.Arrays;

/**
 * 代理人活跃度汇总DO
 * @author chris
 * @since Jan 08.18
 */
public class AgentActivitySummaryDO {

    private Integer totalAgentNums = 0; //总代理人数

    private BigDecimal totalSalesAmount = BigDecimal.ZERO; //总销售额

    private Integer totalOrderNums = 0; //总订单数

    private Integer totalHasOrderAgentNums = 0; //总出单代理人数

    private String totalAgentActivity; //总代理人活跃度

    public Integer getTotalAgentNums() {
        return totalAgentNums;
    }

    public void setTotalAgentNums(Integer totalAgentNums) {
        this.totalAgentNums = totalAgentNums;
    }

    public BigDecimal getTotalSalesAmount() {
        return totalSalesAmount;
    }

    public void setTotalSalesAmount(BigDecimal totalSalesAmount) {
        this.totalSalesAmount = totalSalesAmount;
    }

    public Integer getTotalOrderNums() {
        return totalOrderNums;
    }

    public void setTotalOrderNums(Integer totalOrderNums) {
        this.totalOrderNums = totalOrderNums;
    }

    public Integer getTotalHasOrderAgentNums() {
        return totalHasOrderAgentNums;
    }

    public void setTotalHasOrderAgentNums(Integer totalHasOrderAgentNums) {
        this.totalHasOrderAgentNums = totalHasOrderAgentNums;
    }

    public String getTotalAgentActivity() {
        return totalAgentActivity;
    }

    public void setTotalAgentActivity(String totalAgentActivity) {
        this.totalAgentActivity = totalAgentActivity;
    }


    public void accumulateCalc(AgentActivityResultDO result) {
        this.totalAgentNums += null == result.getAgentNums() ? 0 : result.getAgentNums();
        this.totalOrderNums += null == result.getOrderNums() ? 0 : result.getOrderNums();
        this.totalHasOrderAgentNums += null == result.getHasOrderAgentNums() ? 0 : result.getHasOrderAgentNums();
        this.totalSalesAmount = this.totalSalesAmount.add(null == result.getSalesAmount() ? BigDecimal.ZERO : result.getSalesAmount());
    }

    public void calcTotalAgentActivity() {
        if (this.totalAgentNums == 0) {
            this.totalAgentActivity = "0";
        } else {
            this.totalAgentActivity = new BigDecimal(this.totalHasOrderAgentNums).divide(new BigDecimal(this.totalAgentNums), 2, BigDecimal.ROUND_HALF_EVEN).multiply(new BigDecimal(100)).toString();
        }
    }
}
