package com.jdy.b2b.web.pojo.front;

import java.time.LocalDate;

/**
 * Created by dugq on 2017/9/21.
 */
public enum FrontCalendarCssEnum {
    outMonth("s-day s-pm s-out"),outDay("s-day s-out"), now("s-day s-today"),nowMonth("s-day"),laterDay("s-day s-already"),laterMonth("s-day s-future s-already");

    private String value;

    FrontCalendarCssEnum(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static FrontCalendarCssEnum ofValue(LocalDate date , int month){
        LocalDate today = LocalDate.now();
        if(today.getMonthValue() == month){
            if(date.getMonthValue() < month){
                return outMonth;
            }else if(date.getMonthValue() > month){
                return laterMonth;
            }else{
                if(date.isBefore(today)){
                    return  outDay;
                }else if(date.isAfter(today)){
                    return laterDay;
                }else{
                    return now;
                }
            }
        }else{
            if(date.getMonthValue()<month){
                return outDay;
            }else if(date.getMonthValue()> month){
                    return laterMonth;
            }else{
                return nowMonth;
            }

        }
    }
}
