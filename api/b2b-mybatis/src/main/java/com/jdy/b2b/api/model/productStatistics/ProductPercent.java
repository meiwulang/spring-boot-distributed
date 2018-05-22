package com.jdy.b2b.api.model.productStatistics;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * Created by dugq on 2017/11/16.
 */
public class ProductPercent implements Serializable{
    private static final long serialVersionUID = -5166838691587689547L;
    private String name;
    private BigDecimal value;

    public ProductPercent() {
    }

    public ProductPercent(String name, BigDecimal value) {
        this.name = name;
        this.value = value;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }
}
