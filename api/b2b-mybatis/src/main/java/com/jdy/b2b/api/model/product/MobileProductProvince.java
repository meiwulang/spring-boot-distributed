package com.jdy.b2b.api.model.product;

/**
 * Created by yangcheng on 2017/9/23.
 */
public class MobileProductProvince {
    private Long pId;
    private String province;
    private String city;

    public Long getpId() {
        return pId;
    }

    public void setpId(Long pId) {
        this.pId = pId;
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
}
