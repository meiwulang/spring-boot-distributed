package com.jdy.b2b.api.model.credit;

import java.math.BigDecimal;
import java.util.Date;

public class CreditDTO {
    private Long cSupplierId;
    //0:全部 1:余额 2:无余额 最大2 最小0
    private Integer balanceState;

    private String searchStr;

    public Long getcSupplierId() {
        return cSupplierId;
    }

    public void setcSupplierId(Long cSupplierId) {
        this.cSupplierId = cSupplierId;
    }

    public Integer getBalanceState() {
        return balanceState;
    }

    public void setBalanceState(Integer balanceState) {
        this.balanceState = balanceState;
    }

    public String getSearchStr() {
        return searchStr;
    }

    public void setSearchStr(String searchStr) {
        this.searchStr = searchStr;
    }
}