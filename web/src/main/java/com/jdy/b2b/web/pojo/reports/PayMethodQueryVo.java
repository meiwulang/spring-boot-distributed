package com.jdy.b2b.web.pojo.reports;


import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.util.Date;

/**
 * Created by yangcheng on 2017/9/11.
 */
@ApiModel
public class PayMethodQueryVo extends BaseVO {
    @ApiModelProperty(value = "大区名称")
    private String cGroup;
    @ApiModelProperty(value = "省名称")
    private String province;
    @ApiModelProperty(value = "市名称")
    private String city;
    @ApiModelProperty(value = "日期类型 1:出团日期 2 交易日期")
    private Integer dateType;//1:出团日期 2 交易日期
    @ApiModelProperty(value = "最小日期")
    private Date minDate;
    @ApiModelProperty(value = "最大日期")
    private Date maxDate;

    public String getcGroup() {
        return cGroup;
    }

    public void setcGroup(String cGroup) {
        this.cGroup = cGroup;
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
}
