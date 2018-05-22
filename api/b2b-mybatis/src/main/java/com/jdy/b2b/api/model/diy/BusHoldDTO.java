package com.jdy.b2b.api.model.diy;

import com.jdy.b2b.api.model.BusHold;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/8/24 15:48
 */
public class BusHoldDTO extends BusHold {

    private String companyName;

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }
}
