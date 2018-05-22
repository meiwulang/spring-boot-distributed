package com.jdy.b2b.api.model.productStatistics;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * Created by dugq on 2017/12/27.
 */
public class ParentOrder implements Serializable {
    private static final long serialVersionUID = -3077348258296208682L;

    private BigDecimal sales;
    private Integer orderNum;
    private Integer touristNum;
    private int type;

    public ParentOrder() {
    }

    public ParentOrder(int type) {
        this.type = type;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public BigDecimal getSales() {
        return sales;
    }

    public void setSales(BigDecimal sales) {
        this.sales = sales;
    }

    public Integer getOrderNum() {
        return orderNum;
    }

    public void setOrderNum(Integer orderNum) {
        this.orderNum = orderNum;
    }

    public Integer getTouristNum() {
        return touristNum;
    }

    public void setTouristNum(Integer touristNum) {
        this.touristNum = touristNum;
    }
}
