package com.jdy.b2b.web.enums;

import java.util.Arrays;

/**
 * @Description 订单支付方式
 * @Author yyf
 * @DateTime 2017/9/1 15:33
 */
public enum OrderSourceEnum {
    H5((byte) 2, "H5全款"),
    CS((byte) 3, "小程序"),
    SF((byte) 4, "H5首付款");

    private Byte value;
    private String desc;

    OrderSourceEnum(Byte value, String desc) {
        this.value = value;
        this.desc = desc;
    }

    public Byte getValue() {
        return value;
    }

    public String getDesc() {
        return desc;
    }

    public static String getDescByValue(Byte value) {
        return Arrays.stream(values()).filter(e -> e.equals(value)).map(e -> e.getDesc()).findFirst().orElse("");
    }

    public boolean equals(Byte value) {
        if (value == null) {
            return false;
        }
        if (this.value.equals(value)) {
            return true;
        } else {
            return false;
        }
    }

    public boolean equals(Integer value) {
        if (value == null) {
            return false;
        }
        if (this.value.equals(value.byteValue())) {
            return true;
        } else {
            return false;
        }
    }
}
