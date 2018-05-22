package com.jdy.b2b.api.model.bill;

/**
 * Created by strict on 2017/9/6.
 */
public class CreditBillVo extends Bill {
    private String createTimeS;
    private String createTimeE;
    private Integer cSettlementCycle;
    private String searchKey;
    private Integer excludeRevoked; //不包括已撤销的 1表示启用  0表示不启用
    private Integer isSup; // 是否是上级部门(即有子公司) 1是  0否

    private Long bBuyerCompanyId;

    public Integer getExcludeRevoked() {
        return excludeRevoked;
    }

    public void setExcludeRevoked(Integer excludeRevoked) {
        this.excludeRevoked = excludeRevoked;
    }

    public Integer getIsSup() {
        return isSup;
    }

    public void setIsSup(Integer isSup) {
        this.isSup = isSup;
    }

    public String getCreateTimeS() {
        return createTimeS;
    }

    public void setCreateTimeS(String createTimeS) {
        this.createTimeS = createTimeS;
    }

    public String getCreateTimeE() {
        return createTimeE;
    }

    public void setCreateTimeE(String createTimeE) {
        this.createTimeE = createTimeE;
    }

    public Integer getcSettlementCycle() {
        return cSettlementCycle;
    }

    public void setcSettlementCycle(Integer cSettlementCycle) {
        this.cSettlementCycle = cSettlementCycle;
    }

    public String getSearchKey() {
        return searchKey;
    }

    public void setSearchKey(String searchKey) {
        this.searchKey = searchKey;
    }

    public Long getbBuyerCompanyId() {
        return bBuyerCompanyId;
    }

    public void setbBuyerCompanyId(Long bBuyerCompanyId) {
        this.bBuyerCompanyId = bBuyerCompanyId;
    }
}
