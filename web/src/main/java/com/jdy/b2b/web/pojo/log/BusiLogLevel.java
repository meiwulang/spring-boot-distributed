package com.jdy.b2b.web.pojo.log;

import org.springframework.util.StringUtils;

/**
 * Created by dugq on 2017/8/7.
 */
public enum BusiLogLevel {
   //不保存
    NONE(Integer.MAX_VALUE,"none"),
    //只保存成功的操作
    SUCCESS(0,"success"),
    //全部保存
    ALL(Integer.MIN_VALUE,"all");
    private int value;
    private String name;
    protected final static int busiLogLevel;

    static {
        String property = System.getProperty("jdy.busiLog.level");
        if(StringUtils.isEmpty(property)){
            property = "ALL";
        }
        busiLogLevel = BusiLogLevel.valueOf(property).getValue();
    }

    BusiLogLevel(int value, String name) {
        this.value = value;
        this.name = name;
    }

    public static boolean isStore(String code){
        if(Integer.parseInt(code) >= busiLogLevel){
            return true;
        }
        return false;
    }

    public int getValue() {
        return value;
    }

    public String getName() {
        return name;
    }
}
