package com.jdy.b2b.api.model.admission;


import java.util.List;
import java.util.Objects;

/**
 * Created by dugq on 2018/4/17.
 */
public class AdmissionBaseDto extends AdmissionBaseWithBLOBs {
    //产品经理
    private String productManagerName;
    //总库存
    private int totalStock;

    public int getTotalStock() {
        return totalStock;
    }

    public void setTotalStock(int totalStock) {
        this.totalStock = totalStock;
    }

    public String getProductManagerName() {
        return productManagerName;
    }

    public void setProductManagerName(String productManagerName) {
        this.productManagerName = productManagerName;
    }

    @Override
    public boolean equals(Object obj) {
        if(obj instanceof AdmissionBaseDto){
            return this.getId().intValue() == ((AdmissionBaseDto) obj).getId().intValue();
        }
        return super.equals(obj);
    }
}
