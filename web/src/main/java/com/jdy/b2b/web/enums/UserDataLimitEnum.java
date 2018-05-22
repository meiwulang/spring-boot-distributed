package com.jdy.b2b.web.enums;

/**
 * @Description 用户数据权限级别
 * @Author yyf
 * @DateTime 2017/8/30 14:41
 */
public enum UserDataLimitEnum {
    DATA_LIMIT_USER(0, "用户级"),
    DATA_LIMIT_DEPART(1, "部门级"),
    DATA_LIMIT_COMPANY(2, "公司级"),
    DATA_LIMIT_SYSTEM(3, "系统级");

    private Integer value;
    private String desc;

    UserDataLimitEnum(Integer value, String desc) {
        this.value = value;
        this.desc = desc;
    }

    public Integer getValue() {
        return value;
    }

    public String getDesc() {
        return desc;
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
