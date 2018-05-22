package com.jdy.b2b.api.enums;

import java.util.Arrays;

/**
 * @Description 订单价格详情类型
 * @Author yyf
 * @DateTime 2017/9/1 15:33
 */
public enum PriceDetailTypeEnum {
    TICKET_PRICE(0, "票价"),
    ROOM_DIFF(1, "房差"),
    ADJUST(2, "调整"),
    ACTIVITY(3, "活动"),
    PENAL(4, "违约金"),
    PICKUP(5, "接送费");

    private Integer value;
    private String desc;

    PriceDetailTypeEnum(Integer value, String desc) {
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
