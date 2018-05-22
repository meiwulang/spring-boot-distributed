package com.jdy.b2b.api.model.fingercrm;

/**
 * Created by strict on 2017/12/14.
 */
public class ProductTicketSyncDTO {
    private Long productId;
    private Long categoryId;
    private String category;
    private Long unitPriceId;
    private String priceName;
    private Integer rebateType;
    private String brokerage1;
    private String brokerage2;
    private String brokerage3;

    public Integer getRebateType() {
        return rebateType;
    }

    public void setRebateType(Integer rebateType) {
        this.rebateType = rebateType;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Long getUnitPriceId() {
        return unitPriceId;
    }

    public void setUnitPriceId(Long unitPriceId) {
        this.unitPriceId = unitPriceId;
    }

    public String getPriceName() {
        return priceName;
    }

    public void setPriceName(String priceName) {
        this.priceName = priceName;
    }

    public String getBrokerage1() {
        return brokerage1;
    }

    public void setBrokerage1(String brokerage1) {
        this.brokerage1 = brokerage1;
    }

    public String getBrokerage2() {
        return brokerage2;
    }

    public void setBrokerage2(String brokerage2) {
        this.brokerage2 = brokerage2;
    }

    public String getBrokerage3() {
        return brokerage3;
    }

    public void setBrokerage3(String brokerage3) {
        this.brokerage3 = brokerage3;
    }
}
