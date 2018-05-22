package com.jdy.b2b.web.pojo.label;


public class LabelDTO{
    private Long id;

    private Long companyId;

    private String lName;

    private Long lGroupId;

    private Long lModuleId;

    private Integer lSort;

    private String lColor;

    private Integer lStatus;

    private String dName;

    private String lgName;

    public String getLgName() {
        return lgName;
    }

    public void setLgName(String lgName) {
        this.lgName = lgName;
    }

    public String getdName() {
        return dName;
    }

    public void setdName(String dName) {
        this.dName = dName;
    }

    public Long getlModuleId() {
        return lModuleId;
    }

    public void setlModuleId(Long lModuleId) {
        this.lModuleId = lModuleId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getlName() {
        return lName;
    }

    public void setlName(String lName) {
        this.lName = lName == null ? null : lName.trim();
    }

    public Long getlGroupId() {
        return lGroupId;
    }

    public void setlGroupId(Long lGroupId) {
        this.lGroupId = lGroupId;
    }

    public Integer getlSort() {
        return lSort;
    }

    public void setlSort(Integer lSort) {
        this.lSort = lSort;
    }

    public String getlColor() {
        return lColor;
    }

    public void setlColor(String lColor) {
        this.lColor = lColor == null ? null : lColor.trim();
    }

    public Integer getlStatus() {
        return lStatus;
    }

    public void setlStatus(Integer lStatus) {
        this.lStatus = lStatus;
    }

}