package com.jdy.b2b.web.enums;

import java.util.Arrays;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/12/13 9:57
 */
public enum UserPosEnum {
    VP(1, 200L, "销售总"),
    DIRECTOR(2, 201L, "销售总监"),
    MANAGER(3, 202L, "销售经理"),
    AGENT(4, null, "签约代理人"),
    NON_SALE(5, null, "非销售岗"),
    INSTRUCTOR(6, 232L, "指导员");

    private Integer posId;
    private Long dbId;
    private String desc;

    UserPosEnum(Integer posId, Long dbId, String desc) {
        this.posId = posId;
        this.dbId = dbId;
        this.desc = desc;
    }

    public Integer getPosId() {
        return posId;
    }

    public Long getDbId() {
        return dbId;
    }

    public String getDesc() {
        return desc;
    }

    public static Integer getPosIdByDbid(Long dbId) {
        if (dbId == null) return null;
        UserPosEnum e = Arrays.stream(values()).filter(p -> dbId.equals(p.getDbId())).findFirst().orElse(null);
        if (e != null) {
            return e.getPosId();
        } else {
            return null;
        }
    }
}
