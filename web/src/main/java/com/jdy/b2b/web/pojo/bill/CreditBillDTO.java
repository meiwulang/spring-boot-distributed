package com.jdy.b2b.web.pojo.bill;

import com.jdy.b2b.web.pojo.order.Bill;

/**
 * Created by strict on 2017/9/5.
 */
public class CreditBillDTO extends Bill {
    private Integer cSettlementCycle;//结算方式
    private Integer cSettlementDay;// 结算日期 周结:1:周一 2:周二 3:周三 4:周四 5:周五 6:周六 7:周日 月结:1:1日 2:2日.....28
    private Long bBuyerCompanyId;
    private String bBuyerCompanyName;
    private Double progress;

    public Double getProgress() {
        return getbPayedAmount().doubleValue()/getbAmount().doubleValue()*100;
    }

    public void setProgress(Double progress) {
        this.progress = progress;
    }
    public Integer getcSettlementCycle() {
        return cSettlementCycle;
    }

    public void setcSettlementCycle(Integer cSettlementCycle) {
        this.cSettlementCycle = cSettlementCycle;
    }

    public Integer getcSettlementDay() {
        return cSettlementDay;
    }

    public void setcSettlementDay(Integer cSettlementDay) {
        this.cSettlementDay = cSettlementDay;
    }

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
}
