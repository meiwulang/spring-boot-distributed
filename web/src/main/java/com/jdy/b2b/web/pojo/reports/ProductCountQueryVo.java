package com.jdy.b2b.web.pojo.reports;


import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.util.Date;

/**
 * Created by yangcheng on 2017/9/14.
 */
@ApiModel
public class ProductCountQueryVo extends BaseVO {
    @ApiModelProperty(value = "分销商id")
    private Long buyerId;
    @ApiModelProperty(value = "品牌id")
    private Long brandId;
    @ApiModelProperty(value = "日期类型 1.出团日期 2.交易日期")
    private Integer dateType; //1.出团日期 2.交易日期
    @ApiModelProperty(value = "最小日期")
    private Date minDate;
    @ApiModelProperty(value = "最大日期")
    private Date maxDate;
    @ApiModelProperty(value = "模糊查询字符串")
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
