package com.jdy.b2b.web.enums;

import java.util.Arrays;

/**
 * @Description 团期状态
 * @Author yyf
 * @DateTime 2018/3/9 15:33
 */
public enum ScheduleSettingStatusEnum {
    ON_LINE(0, "待发团"),
    CREDIT_PAY(1, "发团中"),
    OFF_LINE(2, "已结团"),
    WX_PAY(3, "已回团"),
    MIX_PAY(4, "已取消");

    private Integer value;
    private String desc;

    ScheduleSettingStatusEnum(Integer value, String desc) {
        this.value = value;
        this.desc = desc;
    }

    public Integer getValue() {
        return value;
    }

    public String getDesc() {
        return desc;
    }

    public static String getDescByValue(Integer value) {
        return Arrays.stream(values()).filter(e -> e.equals(value)).map(e -> e.getDesc()).findFirst().orElse("未支付");
    }

    public boolean equals(Integer value) {
        return this.value.equals(value);
    }
}
