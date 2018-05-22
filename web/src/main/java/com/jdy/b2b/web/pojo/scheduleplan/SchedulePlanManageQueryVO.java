package com.jdy.b2b.web.pojo.scheduleplan;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.time.LocalDate;

/**
 * Created by yangcheng on 2017/12/5.
 */
@ApiModel
public class SchedulePlanManageQueryVO extends BaseVO {
    @ApiModelProperty(value = "开始时间")
    private LocalDate beginDate;
    @ApiModelProperty(value = "结束时间")
    private LocalDate endDate;
    @ApiModelProperty(value = "报表导出时传递 null:全部  0:未付款  1:已付款")
    private Integer flag;
    @ApiModelProperty(value = "产品id  调用出团计划列表时传递 ")
    private Long productId;
    @ApiModelProperty(value = "系统级用户要查询的公司id 如果当前用户是非系统级 则不需要传递companyId 即使传递,后台也会强制覆盖掉")
    private Long companyId;

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getFlag() {
        return flag;
    }

    public void setFlag(Integer flag) {
        this.flag = flag;
    }

    public LocalDate getBeginDate() {
        return beginDate;
    }

    public void setBeginDate(LocalDate beginDate) {
        this.beginDate = beginDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
}
