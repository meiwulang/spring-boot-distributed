package com.jdy.b2b.api.model;

import java.util.List;

/**
 * Created by strict on 2018/3/23.
 */
public class ProductNotify {
    private List<Long> productIds;
    private Integer dataSource = 0; //0 b2b; 10 礼品卡
    private Integer status;
    private Long companyId;
    private String companyName;
    private Integer action;
    private Long categoryId;
    private Long unitPriceId;

    public List<Long> getProductIds() {
        return productIds;
    }

    public void setProductIds(List<Long> productIds) {
        this.productIds = productIds;
    }

    public Integer getDataSource() {
        return dataSource;
    }

    public void setDataSource(Integer dataSource) {
        this.dataSource = dataSource;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public Integer getAction() {
        return action;
    }

    public void setAction(Integer action) {
        this.action = action;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public Long getUnitPriceId() {
        return unitPriceId;
    }

    public void setUnitPriceId(Long unitPriceId) {
        this.unitPriceId = unitPriceId;
    }
}
