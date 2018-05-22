package com.jdy.b2b.api.model.productStatistics;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * Created by dugq on 2017/11/16.
 */
public class ProductOrder extends ParentOrder implements Serializable {
    private static final long serialVersionUID = -2270436184091469127L;
    private Long productId;
    private String productName;

    public ProductOrder() {
        super(3);
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }
}
