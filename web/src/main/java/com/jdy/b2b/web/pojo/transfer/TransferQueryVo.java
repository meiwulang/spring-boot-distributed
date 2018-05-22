package com.jdy.b2b.web.pojo.transfer;


import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.util.Date;
@ApiModel
public class TransferQueryVo extends BaseVO {
    @ApiModelProperty(value="类型 0:供应商实收 1:手续费 2:佣金 3:提现手续费")
    @Min(value=0,message = "类型最小为0")
    @Max(value=3,message = "类型最大为3")
    private Integer tTransferType;
    @ApiModelProperty(value="状态 0:已失败 1:处理中 2:已转账 3:已撤销",hidden = true)
    @Min(value=0,message = "状态最小为0")
    @Max(value=3,message = "状态最大为3")
    private Integer tStatus;
    @ApiModelProperty(value="最小转账时间")
    private Date minTransferTime;
    @ApiModelProperty(value="最大转账时间")
    private Date maxTransferTime;
    @ApiModelProperty(value="模糊查询字符串")
    private String searchStr;

    public Integer gettTransferType() {
        return tTransferType;
    }

    public void settTransferType(Integer tTransferType) {
        this.tTransferType = tTransferType;
    }

    public Integer gettStatus() {
        return tStatus;
    }

    public void settStatus(Integer tStatus) {
        this.tStatus = tStatus;
    }

    public Date getMinTransferTime() {
        return minTransferTime;
    }

    public void setMinTransferTime(Date minTransferTime) {
        this.minTransferTime = minTransferTime;
    }

    public Date getMaxTransferTime() {
        return maxTransferTime;
    }

    public void setMaxTransferTime(Date maxTransferTime) {
        this.maxTransferTime = maxTransferTime;
    }

    public String getSearchStr() {
        return searchStr;
    }

    public void setSearchStr(String searchStr) {
        this.searchStr = searchStr;
    }

}