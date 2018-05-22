package com.jdy.b2b.web.pojo.admission;

import io.swagger.annotations.ApiModelProperty;

import java.util.List;

/**
 * Created by dugq on 2018/4/17.
 */
public class AdmissionBaseDto extends AdmissionBaseWithBLOBs {
    @ApiModelProperty(value = "产品经理名称")
    private String productManagerName;
    @ApiModelProperty(value = "库存总和")
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


}
