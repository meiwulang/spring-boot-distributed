package com.jdy.b2b.api.model.fingercrm;

import java.util.List;

/**
 * Created by strict on 2017/10/10.
 */
public class ProductSyncVO {
    private Long productId;
    private Boolean publish;  // 0 发布   1 无效  2 待入库  3 入库
    private Long categoryId;
    private Long companyId;
    private Integer deliveryType; //0组  1 个人
    private List<ProductTicketSyncDTO> promotionList;

    private List<String> vGroupIds; //虚拟分组json

    private List<Long> productIds;

    public List<Long> getProductIds() {
        return productIds;
    }

    public void setProductIds(List<Long> productIds) {
        this.productIds = productIds;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public Integer getDeliveryType() {
        return deliveryType;
    }

    public void setDeliveryType(Integer deliveryType) {
        this.deliveryType = deliveryType;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public List<ProductTicketSyncDTO> getPromotionList() {
        return promotionList;
    }

    public void setPromotionList(List<ProductTicketSyncDTO> promotionList) {
        this.promotionList = promotionList;
    }

    public List<String> getvGroupIds() {
        return vGroupIds;
    }

    public void setvGroupIds(List<String> vGroupIds) {
        this.vGroupIds = vGroupIds;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Boolean getPublish() {
        return publish;
    }

    public void setPublish(Boolean publish) {
        this.publish = publish;
    }

}
