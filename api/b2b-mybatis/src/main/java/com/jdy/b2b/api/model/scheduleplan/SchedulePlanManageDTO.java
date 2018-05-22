package com.jdy.b2b.api.model.scheduleplan;

import com.jdy.b2b.api.model.product.BaseDO;
import org.apache.tomcat.jni.Local;

import java.time.LocalDate;
import java.util.Date;

/**
 * Created by yangcheng on 2017/12/5.
 */
public class SchedulePlanManageDTO extends BaseDO{
    private LocalDate beginDate;
    private LocalDate endDate;
    private Long productId;
    private Long companyId;

    //出团计划列表分页
    private LocalDate beginPageDate;
    private LocalDate endPageDate;

    public LocalDate getBeginPageDate() {
        return beginPageDate;
    }

    public void setBeginPageDate(LocalDate beginPageDate) {
        this.beginPageDate = beginPageDate;
    }

    public LocalDate getEndPageDate() {
        return endPageDate;
    }

    public void setEndPageDate(LocalDate endPageDate) {
        this.endPageDate = endPageDate;
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

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }
}
