package com.jdy.b2b.api.enums;

import java.util.Arrays;

/**
 * Created by yangcheng on 2017/12/19.
 */
public enum RequireStatus {
    UNACCEPT(1,"待受理"),
    CUSTOMIZED(2,"定制中"),
    FEEDBACK(3,"已反馈"),
    CONFIRMED(4,"已确认");

    private Integer value;
    private String desc;

    RequireStatus(Integer value,String desc){
        this.value = value;
        this.desc = desc;
    }
    public Integer getValue() {
        return value;
    }
    public String getDesc() {
        return desc;
    }

    //通过value获取desc
    public static String getDescByValue(Integer value) {
        return Arrays.stream(values()).filter(e -> e.equals(value)).map(e -> e.getDesc()).findFirst().orElse("");
    }
    //通过desc获取value
    public static Integer getValueByDesc(String desc) {
        return Arrays.stream(values()).filter(e -> getDescByValue(e.getValue()).equals(desc)).map(e -> e.getValue()).findFirst().orElse(0);
    }

    public boolean equals(Integer value) {
        if (value == null) {
            return false;
        }
        if (this.value.equals(value)) {
            return true;
        } else {
            return false;
        }
    }
}
