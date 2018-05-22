package com.jdy.b2b.api.model.company;

/**
 * Created by dugq on 2017/7/14.
 */
public enum AccountStatusEnum {
     NONE(0,"未开户"), FINACCOUNT(1,"付款账户"), RECEIPT_ACCOUNT(2,"收款账户"),ALL(3,"双开");

    private int value;
    private String description;

    AccountStatusEnum(int value, String description) {
        this.value = value;
        this.description = description;
    }

    public int getValue() {
        return value;
    }

    public String getDescription() {
        return description;
    }
}
