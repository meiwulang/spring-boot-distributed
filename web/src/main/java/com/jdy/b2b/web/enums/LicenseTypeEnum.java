package com.jdy.b2b.web.enums;

import java.util.Arrays;

import static org.apache.commons.lang3.StringUtils.isBlank;

/**
 * @Description 证件类型
 * @Author yyf
 * @DateTime 2017/9/1 15:33
 */
public enum LicenseTypeEnum {
    ID_CARD(0, "身份证"),
    PASSPORT(1, "护照"),
    OFFICER(2, "军官证"),
    HUIXIANG(3, "回乡证"),
    TAIWAN(4, "台胞证"),
    HAIYUAN(5, "国际海员证"),
    GANGAO(6, "港澳通行证"),
    FUTAI(7, "赴台证"),
    QITA(8, "其他");

    private Integer value;
    private String desc;

    LicenseTypeEnum(Integer value, String desc) {
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
        return Arrays.stream(values()).filter(e -> e.equals(value)).map(e -> e.getDesc()).findFirst().orElse("未知类型");
    }

    public static Integer getValueByDesc(String desc) {
        if (isBlank(desc)) return null;
        for (LicenseTypeEnum t : values()) {
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
}
