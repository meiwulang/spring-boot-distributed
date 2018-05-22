package com.jdy.b2b.web.pojo.order;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.apache.commons.lang3.StringUtils;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/9/7 13:46
 */
@ApiModel(description = "订单行程dto")
public class OrderTripDTO extends Trip {

    @ApiModelProperty(value = "入住酒店")
    private String hotelNames;
    @ApiModelProperty(value = "就餐说明")
    private String mealsInfo;

    //X月X日
    private String dayInfo;

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

    public String getDayInfo() {
        return dayInfo;
    }

    public void setDayInfo(String dayInfo) {
        this.dayInfo = dayInfo;
    }
}
