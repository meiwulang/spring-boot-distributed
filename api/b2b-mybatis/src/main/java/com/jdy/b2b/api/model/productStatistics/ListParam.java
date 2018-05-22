package com.jdy.b2b.api.model.productStatistics;

import java.io.Serializable;
import java.time.LocalDate;

/**
 * Created by dugq on 2017/11/16.
 */
public class ListParam implements Serializable {
    private static final long serialVersionUID = -2755224520098101479L;

    private Integer dataLimit;
    private Integer groupBy;
    private Integer filterBy;
    private Integer type;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long productId;
    private Long departmentId;
    private Long companyId;
    private String departmentPids;
    private String companyPids;
    private Long agentId;
    private boolean useDepartment;


    
    public Integer getDataLimit() {
        return dataLimit;
    }

    public void setDataLimit(Integer dataLimit) {
        this.dataLimit = dataLimit;
    }

    public Integer getGroupBy() {
        return groupBy;
    }

    public void setGroupBy(Integer groupBy) {
        this.groupBy = groupBy;
    }

    public Integer getFilterBy() {
        return filterBy;
    }

    public void setFilterBy(Integer filterBy) {
        this.filterBy = filterBy;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public Long getAgentId() {
        return agentId;
    }

    public void setAgentId(Long agentId) {
        this.agentId = agentId;
    }

    public String getCompanyPids() {
        return companyPids;
    }

    public void setCompanyPids(String companyPids) {
        this.companyPids = companyPids;
    }

    public String getDepartmentPids() {
        return departmentPids;
    }

    public void setDepartmentPids(String departmentPids) {
        this.departmentPids = departmentPids;
    }

    public boolean isUseDepartment() {
        return useDepartment;
    }

    public void setUseDepartment(boolean useDepartment) {
        this.useDepartment = useDepartment;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
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
}
