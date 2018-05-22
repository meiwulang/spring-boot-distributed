package com.jdy.b2b.web.pojo.bill;

import java.math.BigDecimal;

/**
 * Created by strict on 2017/10/24.
 */
public class CompanyOweCreditDTO {
    /**
     * 分销商
     */
    private Long bBuyerCompanyId;

    private String bBuyerCompanyName;
    /**
     * 供应商
     */
    private Long bSalerCompanyId;
    private String bSalerCompanyName;
    /**
     * 总欠款
     */
    private BigDecimal totalOweAmount;
    /**
     *未加入账单欠款金额
     */
    private BigDecimal unJoinBillAmount;
    /**
     *加入账单但未还款的金额
     */
    private BigDecimal unPayedAmount;
    /**
     *出团日  "最早-最晚"  yyyy/mm/dd-yyyy/mm/dd
     */
    private String calenderRange;
    /**
     *交易日  最早-最晚
     */
    private String tradeRange;
    /**
     *账单日  最早-最晚
     */
    private String billDayRange;

    public Long getbBuyerCompanyId() {
        return bBuyerCompanyId;
    }

    public void setbBuyerCompanyId(Long bBuyerCompanyId) {
        this.bBuyerCompanyId = bBuyerCompanyId;
    }

    public String getbBuyerCompanyName() {
        return bBuyerCompanyName;
    }

    public void setbBuyerCompanyName(String bBuyerCompanyName) {
        this.bBuyerCompanyName = bBuyerCompanyName;
    }

    public Long getbSalerCompanyId() {
        return bSalerCompanyId;
    }

    public void setbSalerCompanyId(Long bSalerCompanyId) {
        this.bSalerCompanyId = bSalerCompanyId;
    }

    public String getbSalerCompanyName() {
        return bSalerCompanyName;
    }

    public void setbSalerCompanyName(String bSalerCompanyName) {
        this.bSalerCompanyName = bSalerCompanyName;
    }

    public BigDecimal getTotalOweAmount() {
        if (this.unJoinBillAmount == null){
            this.unJoinBillAmount = BigDecimal.ZERO;
        }
        if (this.unPayedAmount == null){
            this.unPayedAmount = BigDecimal.ZERO;
        }
        return unPayedAmount.add(unJoinBillAmount);
    }

    public void setTotalOweAmount(BigDecimal totalOweAmount) {
        this.totalOweAmount = totalOweAmount;
    }

    public BigDecimal getUnJoinBillAmount() {
        return unJoinBillAmount;
    }

    public void setUnJoinBillAmount(BigDecimal unJoinBillAmount) {
        this.unJoinBillAmount = unJoinBillAmount;
    }

    public BigDecimal getUnPayedAmount() {
        return unPayedAmount;
    }

    public void setUnPayedAmount(BigDecimal unPayedAmount) {
        this.unPayedAmount = unPayedAmount;
    }

    public String getCalenderRange() {
        return calenderRange;
    }

    public void setCalenderRange(String calenderRange) {
        this.calenderRange = calenderRange;
    }

    public String getTradeRange() {
        return tradeRange;
    }

    public void setTradeRange(String tradeRange) {
        this.tradeRange = tradeRange;
    }

    public String getBillDayRange() {
        return billDayRange;
    }

    public void setBillDayRange(String billDayRange) {
        this.billDayRange = billDayRange;
    }
}
