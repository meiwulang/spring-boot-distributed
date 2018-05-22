package com.jdy.b2b.api.model.scheduleplan;

/**
 * Created by yangcheng on 2017/12/10.
 */
public class SchedulePlanExportProductCountDO {
    private Long productId;
    private Integer productCount;

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getProductCount() {
        return productCount;
    }

    public void setProductCount(Integer productCount) {
        this.productCount = productCount;
    }
}
