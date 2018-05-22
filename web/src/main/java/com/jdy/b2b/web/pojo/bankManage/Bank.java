package com.jdy.b2b.web.pojo.bankManage;

public class Bank {
    private Integer id;

    private String bName;

    private String bShortname;

    private Integer bSort;

    private Boolean bStatus;

    private String bCode;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getbName() {
        return bName;
    }

    public void setbName(String bName) {
        this.bName = bName == null ? null : bName.trim();
    }

    public String getbShortname() {
        return bShortname;
    }

    public void setbShortname(String bShortname) {
        this.bShortname = bShortname == null ? null : bShortname.trim();
    }

    public Integer getbSort() {
        return bSort;
    }

    public void setbSort(Integer bSort) {
        this.bSort = bSort;
    }

    public Boolean getbStatus() {
        return bStatus;
    }

    public void setbStatus(Boolean bStatus) {
        this.bStatus = bStatus;
    }

    public String getbCode() {
        return bCode;
    }

    public void setbCode(String bCode) {
        this.bCode = bCode == null ? null : bCode.trim();
    }
}