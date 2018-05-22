package com.jdy.b2b.web.pojo.withdrawals;


import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;
import java.lang.reflect.Member;
import java.math.BigDecimal;
import java.util.Date;

/**
 * Created by yangcheng on 2017/9/8.
 */

@ApiModel
public class WithdrawalsSaveVo  extends BaseVO {
    @ApiModelProperty(value = "账单日")
    @NotNull(message = "账单日不能为空")
    private Date wDay;
    @ApiModelProperty(value = "收款方单位ID")
    @NotNull(message = "收款方单位ID不能为空")
    private Long wInAccountId;
    @ApiModelProperty(value = "收款方单位名称")
    @NotNull(message = "收款方单位名称不能为空")
    private String wInAccount;
    @ApiModelProperty(value = "账单金额")
    @NotNull(message = "账单金额不能为空")
    private BigDecimal wBillAmount;
    @ApiModelProperty(value = "提现手续费")
    @NotNull(message = "提现手续费不能为空")
    private BigDecimal wSeviceCharge;
    @ApiModelProperty(value = "账单生成时间")
    @NotNull(message = "账单生成时间不能为空")
    private Date wBillTime;
    @ApiModelProperty(value = "账单备注")
    private String wRemark;


    public Date getwDay() {
        return wDay;
    }

    public void setwDay(Date wDay) {
        this.wDay = wDay;
    }

    public Long getwInAccountId() {
        return wInAccountId;
    }

    public void setwInAccountId(Long wInAccountId) {
        this.wInAccountId = wInAccountId;
    }

    public String getwInAccount() {
        return wInAccount;
    }

    public void setwInAccount(String wInAccount) {
        this.wInAccount = wInAccount;
    }

    public BigDecimal getwBillAmount() {
        return wBillAmount;
    }

    public void setwBillAmount(BigDecimal wBillAmount) {
        this.wBillAmount = wBillAmount;
    }

    public BigDecimal getwSeviceCharge() {
        return wSeviceCharge;
    }

    public void setwSeviceCharge(BigDecimal wSeviceCharge) {
        this.wSeviceCharge = wSeviceCharge;
    }

    public Date getwBillTime() {
        return wBillTime;
    }

    public void setwBillTime(Date wBillTime) {
        this.wBillTime = wBillTime;
    }

    public String getwRemark() {
        return wRemark;
    }

    public void setwRemark(String wRemark) {
        this.wRemark = wRemark;
    }
}
