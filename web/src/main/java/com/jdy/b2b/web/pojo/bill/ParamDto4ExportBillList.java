package com.jdy.b2b.web.pojo.bill;

import java.io.Serializable;

/**
 * Created by dugq on 2017/9/28.
 */
public class ParamDto4ExportBillList implements Serializable {
    private static final long serialVersionUID = -5654481328869089144L;
    private Long salerCompanyId;
 private String startDate;
 private String endDate;

    public Long getSalerCompanyId() {
        return salerCompanyId;
    }

    public void setSalerCompanyId(Long salerCompanyId) {
        this.salerCompanyId = salerCompanyId;
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
}
