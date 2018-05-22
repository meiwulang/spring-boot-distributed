package com.jdy.b2b.api.enums;

import java.util.Arrays;

/**
 * @Description 订单支付方式
 * @Author yyf
 * @DateTime 2017/9/1 15:33
 */
public enum OrderPayMethodEnum {
    ON_LINE(0, "在线支付"),
    CREDIT_PAY(1, "信用支付"),
    OFF_LINE(2, "线下支付"),
    WX_PAY(3, "微信支付"),
    MIX_PAY(4, "混合支付");

    private Integer value;
    private String desc;

    OrderPayMethodEnum(Integer value, String desc) {
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
