package com.jdy.b2b.api.model.scheduleplan;

/**
 * Created by strict on 2017/12/8.
 */
public class CreateGroupOrderDTO {
    private Long id;
    private Integer pType;
    private String pDestinationPym;
    private String  sCalendar;
    private String uNo;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getpDestinationPym() {
        return pDestinationPym;
    }

    public void setpDestinationPym(String pDestinationPym) {
        this.pDestinationPym = pDestinationPym;
    }

    public String getsCalendar() {
        return sCalendar;
    }

    public void setsCalendar(String sCalendar) {
        this.sCalendar = sCalendar;
    }

    public String getuNo() {
        return uNo;
    }

    public void setuNo(String uNo) {
        this.uNo = uNo;
    }

    public Integer getpType() {
        return pType;
    }

    public void setpType(Integer pType) {
        this.pType = pType;
    }
}
