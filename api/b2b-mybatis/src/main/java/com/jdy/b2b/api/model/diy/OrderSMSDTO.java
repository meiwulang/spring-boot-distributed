package com.jdy.b2b.api.model.diy;

import com.jdy.b2b.api.model.Order;

import java.util.Date;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/9/23 20:13
 */
public class OrderSMSDTO extends Order {

    private String otPhone;
    private String pName;
    private Date sCalendar;

    public String getpName() {
        return pName;
    }

    public void setpName(String pName) {
        this.pName = pName;
    }

    public Date getsCalendar() {
        return sCalendar;
    }

    public void setsCalendar(Date sCalendar) {
        this.sCalendar = sCalendar;
    }

    public String getOtPhone() {
        return otPhone;
    }

    public void setOtPhone(String otPhone) {
        this.otPhone = otPhone;
    }
}
