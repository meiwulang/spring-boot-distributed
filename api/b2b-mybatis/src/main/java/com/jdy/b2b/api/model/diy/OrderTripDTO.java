package com.jdy.b2b.api.model.diy;

import com.jdy.b2b.api.model.product.Trip;
import org.apache.commons.lang3.StringUtils;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/9/7 13:46
 */
public class OrderTripDTO extends Trip {

    private String hotelNames;
    private String mealsInfo;

    public String getHotelNames() {
        return hotelNames;
    }

    public void setHotelNames(String hotelNames) {
        this.hotelNames = hotelNames;
    }

    public String getMealsInfo() {
        String str = "";
        String ms = super.gettMeals();
        if(StringUtils.isNotBlank(ms) && ms.length() == 3) {
            str += ms.charAt(0)=='1'?"早餐":"";
            str += ms.charAt(1)=='1'?"中餐":"";
            str += ms.charAt(2)=='1'?"晚餐":"";
        }
        return str;
    }
}
