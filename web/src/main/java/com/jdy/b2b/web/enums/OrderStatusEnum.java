package com.jdy.b2b.web.enums;

import java.util.Arrays;

import static org.apache.commons.lang3.StringUtils.isBlank;

/**
 * @Description 订单状态
 * @Author yyf
 * @DateTime 2017/9/1 15:33
 */
public enum OrderStatusEnum {
    TO_CONFIRM(0, "待审核"),
    TO_PAY(1, "已报名"),
    PAYED(3, "已全款"),
    REFUND(4, "已取消"),
    REJECT(6, "已驳回");

    private Integer value;
    private String desc;

    OrderStatusEnum(Integer value, String desc) {
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
        return Arrays.stream(values()).filter(e -> e.equals(value)).map(e -> e.getDesc()).findFirst().orElse("");
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

    public boolean equals(String desc) {
        if (isBlank(desc)) {
            return false;
        }
        if (this.desc.equals(desc)) {
            return true;
        } else {
            return false;
        }
    }
}
