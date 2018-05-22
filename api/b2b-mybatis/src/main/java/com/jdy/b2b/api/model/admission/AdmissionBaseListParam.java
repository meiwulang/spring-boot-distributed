package com.jdy.b2b.api.model.admission;


/**
 * Created by dugq on 2018/4/17.
 */
public class AdmissionBaseListParam {

    private Byte admissionType;

    private String searchString;

    private Integer pageIndex;

    private Byte[] status;

    public Byte[] getStatus() {
        return status;
    }

    public void setStatus(Byte[] status) {
        this.status = status;
    }

    public Integer getPageIndex() {
        return pageIndex;
    }

    public void setPageIndex(Integer pageIndex) {
        this.pageIndex = pageIndex;
    }

    public Byte getAdmissionType() {
        return admissionType;
    }

    public void setAdmissionType(Byte admissionType) {
        this.admissionType = admissionType;
    }

    public String getSearchString() {
        return searchString;
    }

    public void setSearchString(String searchString) {
        this.searchString = searchString;
    }
}
