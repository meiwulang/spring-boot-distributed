package com.jdy.b2b.api.enums;

import java.util.Arrays;

/**
 * @Description 产品类型
 * @Author yyf
 * @DateTime 2017/9/1 14:21
 */
public enum ProductTypeEnum {
    TYPE_ZBDX(10, "周边短线"),
    TYPE_GNCX(11, "国内长线"),
    TYPE_CJCX(20, "出境长线"),
    TYPE_CJDX(21, "出境短线"),
    TYPE_YL(30, "邮轮"),
    TYPE_ZYX(50, "自由行"),

    TYPE_CJHD(51,"出境海岛"),
    TYPE_DZLY(52,"定制旅游"),
    TYPE_TDHJ(54,"团队会奖"),
    TYPE_QZFW(55,"签证服务"),
    TYPE_JPYD(56,"机票预订"),
    TYPE_JDYD(57,"酒店预订"),
    TYPE_DXWT(58,"单项委托"),
    TYPE_QTFW(59,"其他服务"),
    TYPE_HWTZ(60,"户外拓展"),
    TYPE_YXYX(61,"游学/研学"),
    TYPE_ZJY(62,"自驾游"),
    TYPE_QQLP(63,"全球旅拍"),
    TYPE_LYJR(64,"旅游金融"),
    TYPE_LYDC(65,"旅游地产"),
    TYPE_QZ(66,"亲子"),
	SINGLE_PHOTO(67,"单一资源+拍"),
	THEMETRAVEL(68,"主题游");
    private Integer value;
    private String desc;

    ProductTypeEnum(Integer value, String desc) {
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
