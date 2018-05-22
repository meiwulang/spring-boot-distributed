package com.jdy.b2b.web.enums;

import java.util.Arrays;

import static org.apache.commons.lang3.StringUtils.isBlank;

/**
 * @Description 出发站类型
 * @Author yyf
 * @DateTime 2017/9/1 15:33
 */
public enum DepartureTypeEnum {
    ORIGINAL(0, "始发站"),
    STANDBY(1, "顺路站"),
    BUSSTOP(2, "班车站");

    private Integer value;
    private String desc;

    DepartureTypeEnum(Integer value, String desc) {
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

    public static Integer getValueByDesc(String desc) {
        if (isBlank(desc)) return null;
        for (DepartureTypeEnum t : values()) {
            if (t.getDesc().equals(desc)) return t.getValue();
        }
        return null;
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

    public boolean equals(Byte value) {
        if (value == null) {
            return false;
        }
        if (this.value.equals(Integer.valueOf(value))) {
            return true;
        } else {
            return false;
        }
    }

}
