package com.jdy.b2b.api.model.reports;

import java.util.Date;

/**
 * Created by yangcheng on 2017/9/11.
 */
public class PayMethodQueryDTO {
    private String cGroup;
    private String province;
    private String city;
    private Integer dateType;//1:出团日期 2 交易日期
    private Date minDate;
    private Date maxDate;

    public String getcGroup() {
        return cGroup;
    }

    public void setcGroup(String cGroup) {
        this.cGroup = cGroup;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Integer getDateType() {
        return dateType;
    }

    public void setDateType(Integer dateType) {
        this.dateType = dateType;
    }

    public Date getMinDate() {
        return minDate;
    }

    public void setMinDate(Date minDate) {
        this.minDate = minDate;
    }

    public Date getMaxDate() {
        return maxDate;
    }

    public void setMaxDate(Date maxDate) {
        this.maxDate = maxDate;
    }
}
