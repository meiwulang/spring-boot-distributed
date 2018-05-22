package com.jdy.b2b.api.model.personalSales;

import java.io.Serializable;
import java.time.LocalDate;

/**
 * Created by dugq on 2017/12/18.
 */
public class PersonalSalesParam implements Serializable{
    private static final long serialVersionUID = 4731267742404901100L;
    private Integer type;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer identityLevel;
    private Integer dataLimit;
    private Long companyId;
    private Long departmentId;

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public Integer getDataLimit() {
        return dataLimit;
    }

    public void setDataLimit(Integer dataLimit) {
        this.dataLimit = dataLimit;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Integer getIdentityLevel() {
        return identityLevel;
    }

    public void setIdentityLevel(Integer identityLevel) {
        this.identityLevel = identityLevel;
    }
}