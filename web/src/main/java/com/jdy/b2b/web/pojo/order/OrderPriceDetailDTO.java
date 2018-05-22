package com.jdy.b2b.web.pojo.order;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/12/14 15:44
 */
@ApiModel
public class OrderPriceDetailDTO extends OrderPriceDetail {

    @ApiModelProperty(value = "类目id")
    private String category;
    @ApiModelProperty(value = "类目名称")
    private String categoryName;

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
}
