package com.jdy.b2b.web.enums;

/**
 * Created by zhangfofa on 2017/10/31.
 */
public enum WechatCloseOrderErrorEnum {
    ORDERPAID("ORDERPAID", "订单已支付，不能发起关单"),
    ORDERCLOSED("ORDERCLOSED", "订单已关闭，无法重复关闭");


    private String value;
    private String desc;

    WechatCloseOrderErrorEnum(String value, String desc) {
        this.value = value;
        this.desc = desc;
    }
    public String getValue() {
        return value;
    }

    public String getDesc() {
        return desc;
    }

    public boolean equals(String value) {
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
