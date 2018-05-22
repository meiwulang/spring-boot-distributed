package com.jdy.b2b.web.pojo.product;

import com.jdy.b2b.web.util.BaseVO;

import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * Created by zhangfofa on 2018/2/6.
 */
public class ProductCosting extends BaseVO {
    private Long scheduleSettingId;
    private ProductCostingTitle productCostingTitle;

    private List<ProductCostingCategoryDetail> productCostingCategoryDetailList;

    public Long getScheduleSettingId() {
        return scheduleSettingId;
    }

    public void setScheduleSettingId(Long scheduleSettingId) {
        this.scheduleSettingId = scheduleSettingId;
    }

    public ProductCostingTitle getProductCostingTitle() {
        return productCostingTitle;
    }

    public void setProductCostingTitle(ProductCostingTitle productCostingTitle) {
        this.productCostingTitle = productCostingTitle;
    }

    public List<ProductCostingCategoryDetail> getProductCostingCategoryDetailList() {
        return productCostingCategoryDetailList;
    }

    public void setProductCostingCategoryDetailList(List<ProductCostingCategoryDetail> productCostingCategoryDetailList) {
        this.productCostingCategoryDetailList = productCostingCategoryDetailList;
    }
}
