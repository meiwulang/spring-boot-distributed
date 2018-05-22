package com.jdy.b2b.api.model.department;

/**
 * Created by dugq on 2017/7/17.
 */
public enum DepartmentStatusEnum {
    EFFECTIVE(0,"有效"), INVALID(1,"无效");

    private int value;
    private String description;

    DepartmentStatusEnum(int value, String description) {
        this.value = value;
        this.description = description;
    }

    public int getValue() {
        return value;
    }

    public String getDescription() {
        return description;
    }

    public static DepartmentStatusEnum ofValue(int value){
        if(value ==0){
            return EFFECTIVE;
        }else if(value ==1){
            return INVALID;
        }else{
            throw new RuntimeException("no match any enum");
        }
    }
}
