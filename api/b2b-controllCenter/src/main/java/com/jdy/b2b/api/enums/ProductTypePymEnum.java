package com.jdy.b2b.api.enums;

import java.util.Arrays;

/**
 * @Description 产品类型
 * @Author yyf
 * @DateTime 2017/9/1 14:21
 */
public enum ProductTypePymEnum {
    TYPE_ZBDX(10, "GD"),
    TYPE_GNCX(11, "GC"),
    TYPE_CJCX(20, "CC"),
    TYPE_CJDX(21, "CD"),
    TYPE_YL(30, "YL"),
    TYPE_ZYX(50, "ZY"),

    TYPE_CJHD(51,"HD"),
    TYPE_DZLY(52,"DZ"),
    TYPE_TDHJ(54,"HJ"),
    TYPE_QZFW(55,"QZ"),
    TYPE_JPYD(56,"JP"),
    TYPE_JDYD(57,"JD"),
    TYPE_DXWT(58,"DX"),
    TYPE_QTFW(59,"QT"),
    TYPE_HWTZ(60,"HW"),
    TYPE_YXYX(61,"YX"),
    TYPE_ZJY(62,"ZJ"),
    TYPE_QQLP(63,"LP"),
    TYPE_LYJR(64,"LJ"),
    TYPE_LYDC(65,"LD"),
    TYPE_QZ(66,"QZ"),
    SINGLE_PHOTO(67,"DP");

    private Integer value;
    private String desc;

    ProductTypePymEnum(Integer value, String desc) {
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
