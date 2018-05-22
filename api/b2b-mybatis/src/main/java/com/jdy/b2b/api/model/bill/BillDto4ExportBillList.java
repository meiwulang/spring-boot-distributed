package com.jdy.b2b.api.model.bill;

import java.math.BigDecimal;

/**
 * Created by dugq on 2017/9/28.
 */
public class BillDto4ExportBillList extends Bill {
    private String bigArea;
    private BigDecimal realPay;
    private String companyNo;

    public String getCompanyNo() {
        return companyNo;
    }

    public void setCompanyNo(String companyNo) {
        this.companyNo = companyNo;
    }

    public String getBigArea() {
        return bigArea;
    }

    public void setBigArea(String bigArea) {
        this.bigArea = bigArea;
    }

    public BigDecimal getRealPay() {
        return realPay;
    }

    public void setRealPay(BigDecimal realPay) {
        this.realPay = realPay;
    }
}
