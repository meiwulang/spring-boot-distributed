package com.jdy.b2b.api.enums;

import java.util.Arrays;

/**
 * @Description 入座方式
 * @Author yyf
 * @DateTime 2017/9/1 15:33
 */
public enum SitTypeEnum {
    NOT_APPO_SEAT(0, "不对号入座"),
    SYS_RANDOM(1, "对号入座（系统随机）"),
    APPO_SEAT(2, "对号入座（人工选择）");

    private Integer value;
    private String desc;

    SitTypeEnum(Integer value, String desc) {
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
