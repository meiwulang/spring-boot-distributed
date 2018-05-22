package com.jdy.b2b.api.model.diy;

import com.jdy.b2b.api.model.OrderPriceDetail;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/12/14 15:44
 */
public class OrderPriceDetailDTO extends OrderPriceDetail {

    private String category;
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
