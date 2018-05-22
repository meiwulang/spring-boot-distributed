package com.jdy.b2b.web.pojo.credit;


import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

/**
 * Created by yangcheng on 2017/8/30.
 */
public class CreditQueryDTO extends BaseVO {
    private Long cSupplierId;
    private Integer balanceState;
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
