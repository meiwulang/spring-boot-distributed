package com.jdy.b2b.web.pojo.credit;


import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * Created by yangcheng on 2017/8/30.
 */
@ApiModel
public class CreditQueryVo extends BaseVO {
    @ApiModelProperty("供应商id")
    private Long cSupplierId;
    @ApiModelProperty(value="余额状态 0:全部 1:余额 2:无余额")
    @Min(value=0,message = "余额状态最小为0")
    @Max(value=2,message = "余额状态最大为2")
    private Integer balanceState;
    @ApiModelProperty("模糊搜索字符串")
    private String searchStr;

    public Long getcSupplierId() {
        return cSupplierId;
    }

    public void setcSupplierId(Long cSupplierId) {
        this.cSupplierId = cSupplierId;
    }

    public Integer getBalanceState() {
        return balanceState;
    }

    public void setBalanceState(Integer balanceState) {
        this.balanceState = balanceState;
    }

    public String getSearchStr() {
        return searchStr;
    }

    public void setSearchStr(String searchStr) {
        this.searchStr = searchStr;
    }
}
