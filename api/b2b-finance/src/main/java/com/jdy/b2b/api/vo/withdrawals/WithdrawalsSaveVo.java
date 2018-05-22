package com.jdy.b2b.api.vo.withdrawals;

import com.jdy.b2b.api.common.BaseVO;

import java.math.BigDecimal;
import java.util.Date;

/**
 * Created by yangcheng on 2017/9/8.
 */
public class WithdrawalsSaveVo  extends BaseVO {

    private Date wDay;

    private Long wInAccountId;

    private String wInAccount;

    private BigDecimal wBillAmount;

    /*计算已付*/

    private BigDecimal wSeviceCharge;

    private Date wBillTime;

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
