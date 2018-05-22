package com.jdy.b2b.web.pojo.reports;


import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.util.Date;

/**
 * Created by yangcheng on 2017/9/11.
 */
@ApiModel
public class BuyerCountQueryVo extends BaseVO {
    @ApiModelProperty(value = "1 出团日期 2 交易日期")
    @Min(value = 1,message = "日期类型最小为1")
    @Max(value = 2,message = "日期类型最大为2")
    private Integer dateType;
    @ApiModelProperty(value = "最小日期")
    private Date minDate;
    @ApiModelProperty(value = "最大日期")
    private Date maxDate;
    @ApiModelProperty(value = "省名称")
    private String province;
    @ApiModelProperty(value = "市名称")
    private String city;
    @ApiModelProperty(value = "地区名称")
    private String area;
    @ApiModelProperty(value = "模糊查询字符串")
    private String searchStr;

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

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getSearchStr() {
        return searchStr;
    }

    public void setSearchStr(String searchStr) {
        this.searchStr = searchStr;
    }
}
