package com.jdy.b2b.api.model;

/**
 * Created by strict on 2018/4/13.
 */
public class OrderTouristAddInfo {

    private Long id;

    private Long otTicketId;

    private String otName;

    private String otPhone;

    private Integer otLicenceType;

    private String otLincese;

    private Integer otTicketType;

    private Integer otType;

    public Integer getOtType() {
        return otType;
    }

    public void setOtType(Integer otType) {
        this.otType = otType;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOtName() {
        return otName;
    }

    public void setOtName(String otName) {
        this.otName = otName;
    }

    public Long getOtTicketId() {
        return otTicketId;
    }

    public void setOtTicketId(Long otTicketId) {
        this.otTicketId = otTicketId;
    }

    public String getOtPhone() {
        return otPhone;
    }

    public void setOtPhone(String otPhone) {
        this.otPhone = otPhone;
    }

    public Integer getOtLicenceType() {
        return otLicenceType;
    }

    public void setOtLicenceType(Integer otLicenceType) {
        this.otLicenceType = otLicenceType;
    }

    public String getOtLincese() {
        return otLincese;
    }

    public void setOtLincese(String otLincese) {
        this.otLincese = otLincese;
    }

    public Integer getOtTicketType() {
        return otTicketType;
    }

    public void setOtTicketType(Integer otTicketType) {
        this.otTicketType = otTicketType;
    }
}
