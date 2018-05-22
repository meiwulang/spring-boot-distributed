package com.jdy.b2b.api.common;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * number工具类
 * Created by ghc on 2017/3/27.
 */
public class NumberUtil {
    // 加法
    public static double add(double v1, double v2) {
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return b1.add(b2).doubleValue();
    }
    // 减法
    public static double sub(double v1, double v2) {
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return b1.subtract(b2).doubleValue();
    }

    // 相等
    public static boolean equels(double v1, double v2) {
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return b1.compareTo(b2)==0;
    }

    // 增加百分比
    public static double addPercent(double v1, double v2) {
        double percent =  1+v2/100;
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(percent));
        return b1.multiply(b2).doubleValue();
    }
    // 减少百分比
    public static double subPercent(double v1, double v2) {
        double percent =  1-v2/100;
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(percent));
        return b1.multiply(b2).doubleValue();
    }
    //固定值
    public static double fixed(double v1, double v2){
        return v2;
    }
    public static double round(double v) {// 截取3位
        BigDecimal b = new BigDecimal(Double.toString(v));
        BigDecimal one = new BigDecimal("1");
        return b.divide(one, 3, BigDecimal.ROUND_HALF_UP).doubleValue();
    }

    public static String decimalFormat(String pattern, double value) {
        return new DecimalFormat(pattern).format(value);
    }

    public static String decimalFormat(double value) {
        return new DecimalFormat("0.00").format(value);
    }

    public static String decimalFormat(double value, String pattern) {
        return new DecimalFormat(pattern).format(value);
    }

    public static String decimalBlankFormat(double value) {
        return new DecimalFormat("0").format(value);
    }

    public static boolean isNumber(String value) { // 检查是否是数字
        String patternStr = "^\\d+$";
        Pattern p = Pattern.compile(patternStr, Pattern.CASE_INSENSITIVE); // 忽略大小写;
        Matcher m = p.matcher(value);
        return m.find();
    }
}
