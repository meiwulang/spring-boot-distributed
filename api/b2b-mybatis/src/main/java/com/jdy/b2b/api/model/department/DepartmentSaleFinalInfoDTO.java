package com.jdy.b2b.api.model.department;

import java.math.BigDecimal;

/**
 * Created by strict on 2017/11/23.
 */
public class DepartmentSaleFinalInfoDTO {
    private String userName;
    private BigDecimal amount = BigDecimal.ZERO;
    private Integer orderNum = 0;

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Integer getOrderNum() {
        return orderNum;
    }

    public void setOrderNum(Integer orderNum) {
        this.orderNum = orderNum;
    }
}
