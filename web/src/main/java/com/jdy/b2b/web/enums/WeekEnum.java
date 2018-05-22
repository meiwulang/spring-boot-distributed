package com.jdy.b2b.web.enums;

import java.util.Arrays;

public enum WeekEnum {
    MONDAY("MONDAY","星期一"),
    TUESDAY("TUESDAY","星期二"),
    WEDNESDAY("WEDNESDAY","星期三"),
    THURSDAY("THURSDAY","星期四"),
    FRIDAY("FRIDAY","星期五"),
    SATURDAY("SATURDAY","星期六"),
    SUNDAY("SUNDAY","星期日");

    private String value;
    private String desc;

    WeekEnum(String value,String desc) {
        this.value = value;
        this.desc = desc;
    }

    public String getValue() {
        return value;
    }
    public String getDesc() {
        return desc;
    }

    public static String getDescByValue(String value) {
        return Arrays.stream(values()).filter(e -> e.getValue().equals(value)).map(e -> e.getDesc()).findFirst().orElse("");
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