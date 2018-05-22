package com.jdy.b2b.api.model.company;

import java.util.Arrays;
import java.util.Objects;
import java.util.stream.Stream;

import org.apache.commons.lang3.StringUtils;

/**
 * Created by dugq on 2017/8/14.
 */
public enum ProductTypeEnum {
    AROUND_SHORT_LINE("周边短线", 10),
    COUNTRY_LONE_LINE("国内长线", 11),
    FOREIGN_TOURISM("出境长线", 20),
    CRUISE("邮轮", 30),
    FEATURE_TOUR("特色旅游", 40),
    SELF_HELP_TRAVEL("自助游", 50),
    TYPE_CJDX( "出境短线",21),
    TYPE_CJHD("出境海岛",51),
    TYPE_DZLY("定制旅游",52),
    TYPE_TDHJ("团队会奖",54),
    TYPE_QZFW("签证服务",55),
    TYPE_JPYD("机票预订",56),
    TYPE_JDYD("酒店预订",57),
    TYPE_DXWT("单项委托",58),
    TYPE_QTFW("其他服务",59),
    TYPE_HWTZ("户外拓展",60),
    TYPE_YXYX("游学/研学",61),
    TYPE_ZJY("自驾游",62),
    TYPE_QQLP("全球旅拍",63),
    TYPE_LYJR("旅游金融",64),
    TYPE_LYDC("旅游地产",65),
    TYPE_QZ("亲子",66),
	SINGLE_PHOTO("单一资源+拍",67),
	THEMETRAVEL("主题游",68);
    private String value;
    private int code;
    private static final String septer = ",";

    ProductTypeEnum(String value, int code) {
        this.value = value;
        this.code = code;
    }

    public static String getDescriptionsOfCOdes(String codes) {
        if (StringUtils.isBlank(codes)) {
            return "";
        }
        return Stream.of(codes.split(septer)).reduce(null, (acc, code) -> {
            String value = ProductTypeEnum.ofValue(code).getValue();
            return Objects.isNull(acc) ? value : acc + septer + value;
        });
    }

    public static ProductTypeEnum ofValue(String code) {
        return Arrays.stream(ProductTypeEnum.values()).filter(e -> e.getCode() == Integer.parseInt(code)).findAny().orElseThrow(() -> new RuntimeException("no such enum"));
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }
}
