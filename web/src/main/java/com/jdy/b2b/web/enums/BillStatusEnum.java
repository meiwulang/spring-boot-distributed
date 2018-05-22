package com.jdy.b2b.web.enums;

import java.util.Arrays;

/**
 * @Description 订单状态
 * @Author  0:生成 1:处理中 2:已受理 3:已提现 4:失败
 * @DateTime 2017/9/1 15:33
 */
public enum BillStatusEnum {
    TO_CONFIRM(0, "生成"),
    TO_PAY(1, "处理中"),
    COLLECTING(2, "已受理"),
    PAYED(3, "已提现"),
    REFUND(4, "失败");

    private Integer value;
    private String desc;

    BillStatusEnum(Integer value, String desc) {
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
}
