package com.jdy.b2b.api.model.productStatistics;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * Created by dugq on 2017/12/26.
 */
public class CompanyOrder extends ParentOrder implements Serializable {

    private static final long serialVersionUID = 3772680503935651304L;

    private Long companyId;
    private String companyName;

    public CompanyOrder() {
        super(0);
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }


}
