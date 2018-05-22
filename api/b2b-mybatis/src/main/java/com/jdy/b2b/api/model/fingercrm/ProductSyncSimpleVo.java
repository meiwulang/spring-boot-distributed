package com.jdy.b2b.api.model.fingercrm;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by strict on 2018/3/25.
 */
public class ProductSyncSimpleVo {
    private Long companyId;
    private String productIds;

    private List<Long> productIdList;

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getProductIds() {
        return productIds;
    }

    public void setProductIds(String productIds) {
        this.productIds = productIds;
    }

    public List<Long> getProductIdList() {
        List<Long> list = new ArrayList<>();
        if(null!=productIds){
            String[] ids = productIds.split(",");
            for (String id: ids) {
                list.add(Long.valueOf(id));
            }
        }
        return list;
    }
}
