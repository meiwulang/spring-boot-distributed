package com.jdy.b2b.api.vo.scheduleplan;

import com.jdy.b2b.api.common.BaseVO;

import java.time.LocalDate;
import java.util.Date;

/**
 * Created by yangcheng on 2017/12/5.
 */
public class SchedulePlanManageQueryVO extends BaseVO{
    private LocalDate beginDate;
    private LocalDate endDate;
    private Long productId;
    private Long companyId;

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public LocalDate getBeginDate() {
        return beginDate;
    }

    public void setBeginDate(LocalDate beginDate) {
        this.beginDate = beginDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
}
