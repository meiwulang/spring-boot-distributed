package com.jdy.b2b.web.pojo.product;

import java.math.BigDecimal;
import java.util.List;

/**
 * Created by zhangfofa on 2018/2/6.
 */
public class ProductCostingCategoryInformation {
    private Long categoryId;

    private String categoryName;

    private Integer listSize;

    private BigDecimal subtotal;

    private List<ProductCostingCategoryDetail> productCostingCategoryDetailList;

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Integer getListSize() {
        return listSize;
    }

    public void setListSize(Integer listSize) {
        this.listSize = listSize;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public List<ProductCostingCategoryDetail> getProductCostingCategoryDetailList() {
        return productCostingCategoryDetailList;
    }

    public void setProductCostingCategoryDetailList(List<ProductCostingCategoryDetail> productCostingCategoryDetailList) {
        this.productCostingCategoryDetailList = productCostingCategoryDetailList;
    }
}
