package com.jdy.b2b.api.vo;

import com.jdy.b2b.api.common.BaseVO;

import java.util.Date;

/**
 * Created by yangcheng on 2017/9/14.
 */
public class ProductCountQueryVo extends BaseVO{
    private Long buyerId;
    private Long brandId;
    private Integer dateType; //1.出团日期 2.交易日期
    private Date minDate;
    private Date maxDate;
    private String searchStr;//产品编号,产品名称

    public Long getBuyerId() {
        return buyerId;
    }

    public void setBuyerId(Long buyerId) {
        this.buyerId = buyerId;
    }

    public Long getBrandId() {
        return brandId;
    }

    public void setBrandId(Long brandId) {
        this.brandId = brandId;
    }

    public Integer getDateType() {
        return dateType;
    }

    public void setDateType(Integer dateType) {
        this.dateType = dateType;
    }

    public Date getMinDate() {
        return minDate;
    }

    public void setMinDate(Date minDate) {
        this.minDate = minDate;
    }

    public Date getMaxDate() {
        return maxDate;
    }

    public void setMaxDate(Date maxDate) {
        this.maxDate = maxDate;
    }

    public String getSearchStr() {
        return searchStr;
    }

    public void setSearchStr(String searchStr) {
        this.searchStr = searchStr;
    }
}
