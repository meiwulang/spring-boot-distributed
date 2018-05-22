package com.jdy.b2b.web.pojo.transfer;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
@ApiModel
public class TransferSaveVo extends BaseVO {
    @ApiModelProperty(value="转出单位id")
    @NotNull(message = "转出单位id不能为null")
    private Long tOutAccountId;
    @ApiModelProperty(value="转出单位名")
    @NotNull(message = "转出单位名不能为null")
    private String tOutAccount;
    @ApiModelProperty(value="转入单位id")
    @NotNull(message = "转入单位id不能为null")
    private Long tInAccountId;
    @ApiModelProperty(value="转入单位名")
    @NotNull(message = "转入单位名不能为null")
    private String tInAccount;
    @ApiModelProperty(value="类型 0:供应商实收 1:手续费 2:佣金 3:提现手续费")
    @Min(value=0,message = "类型最小为0")
    @Max(value=3,message = "类型最大为3")
    @NotNull(message = "类型不能为null")
    private Integer tTransferType;
    @ApiModelProperty(value="转账金额")
    @NotNull(message = "转账金额不能为null")
    private BigDecimal tTransferAmount;
    @ApiModelProperty(value="订单编号")
    @NotNull(message = "订单编号不能为null")
    private String tOrderNo;

    public Long gettOutAccountId() {
        return tOutAccountId;
    }

    public void settOutAccountId(Long tOutAccountId) {
        this.tOutAccountId = tOutAccountId;
    }

    public String gettOutAccount() {
        return tOutAccount;
    }

    public void settOutAccount(String tOutAccount) {
        this.tOutAccount = tOutAccount;
    }

    public Long gettInAccountId() {
        return tInAccountId;
    }

    public void settInAccountId(Long tInAccountId) {
        this.tInAccountId = tInAccountId;
    }

    public String gettInAccount() {
        return tInAccount;
    }

    public void settInAccount(String tInAccount) {
        this.tInAccount = tInAccount;
    }

    public Integer gettTransferType() {
        return tTransferType;
    }

    public void settTransferType(Integer tTransferType) {
        this.tTransferType = tTransferType;
    }


    public BigDecimal gettTransferAmount() {
        return tTransferAmount;
    }

    public void settTransferAmount(BigDecimal tTransferAmount) {
        this.tTransferAmount = tTransferAmount;
    }

    public String gettOrderNo() {
        return tOrderNo;
    }

    public void settOrderNo(String tOrderNo) {
        this.tOrderNo = tOrderNo;
    }
}