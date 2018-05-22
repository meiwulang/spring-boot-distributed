package com.jdy.b2b.api.model.scheduleplan;

import java.math.BigDecimal;

/**
 * Created by yangcheng on 2018/2/7.
 */
public class SchedulePlanCateExpendDO {
    private String dName;
    private Long scheduleId;
    private Long categoryId;
    private BigDecimal cateExpend;
    private String stringCateExpend;

    public String getdName() {
        return dName;
    }

    public void setdName(String dName) {
        this.dName = dName;
    }

    public Long getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(Long scheduleId) {
        this.scheduleId = scheduleId;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public BigDecimal getCateExpend() {
        return cateExpend;
    }

    public void setCateExpend(BigDecimal cateExpend) {
        this.cateExpend = cateExpend;
    }

    public String getStringCateExpend() {
        return stringCateExpend;
    }

    public void setStringCateExpend(String stringCateExpend) {
        this.stringCateExpend = stringCateExpend;
    }
}
