package com.jdy.b2b.api.model.department;

import java.math.BigDecimal;
import java.util.List;

/**
 * Created by strict on 2017/11/9.
 */
public class DepartmentSaleInfoDTO {
    private String userName;
    private BigDecimal amount;
    private Integer orderNum;
    private List<DepartmentSaleInfoDTO> children;

    public List<DepartmentSaleInfoDTO> getChildren() {
        return children;
    }

    public void setChildren(List<DepartmentSaleInfoDTO> children) {
        this.children = children;
    }

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
