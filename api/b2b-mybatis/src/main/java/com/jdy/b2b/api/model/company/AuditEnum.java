package com.jdy.b2b.api.model.company;

/**
 * Created by dugq on 2017/7/10.
 * 单位状态：状态 0:待审核 1:审核通过 2:审核不通过 3： del
 */
public enum AuditEnum {
    WATING_AUDIT(0,"待审核"), PASS(1,"通过"),SEND_BACK(2,"退回"), DEL(3,"del");

    private int value;
    private String description;
    AuditEnum(int value, String description){
        this.value = value;
        this.description = description;
    }

    public int getValue() {
        return value;
    }

    public String getDescription() {
        return description;
    }

    public static AuditEnum ofValue(int status){
        for (AuditEnum e: AuditEnum.values()
             ) {
            if(e.getValue() == status){
                return e;
            }
        }
        throw new RuntimeException("not match any enum");
    }
}
