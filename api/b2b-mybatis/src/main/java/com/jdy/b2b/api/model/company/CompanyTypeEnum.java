package com.jdy.b2b.api.model.company;

/**
 * Created by dugq on 2017/7/13.
 * 类型 0:供应商 1:分销商 2:管理公司
 */
public enum  CompanyTypeEnum {

    SUPPLIER(0,"供应商"), DISTRIBUTOR(1,"分销商"), MANAGEMENT(2,"管理公司"),DISTRIBUTOR_CENTER(3,"分销中心");

    private int value;
    private String description;

    CompanyTypeEnum(int value, String description){
        this.value = value;
        this.description = description;
    }

    public int getValue(){
        return value;
    }

    public String getDescription() {
        return description;
    }

    public static CompanyTypeEnum ofValue(int value){
        switch (value){
            case 0:
                return SUPPLIER;
            case 1 :
                return DISTRIBUTOR;
            case 2 :
                return MANAGEMENT;
            default: throw new RuntimeException("no such object : "+ value);
        }
    }

    public boolean isSupplier(){
        return this.value == 0;
    }

    public boolean isDistributor(){
        return this.value == 1;
    }

    public boolean isManagement(){
        return this.value == 2;
    }
}
