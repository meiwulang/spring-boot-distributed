package com.jdy.b2b.api.vo.withdrawals;

import com.jdy.b2b.api.common.BaseVO;

import java.util.Date;

/**
 * Created by yangcheng on 2017/9/8.
 */
public class WithdrawalsUpdateVo  extends BaseVO {
    private Long id;

    private Integer wStatus;

    private Date wWithdrawalsTime;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getwStatus() {
        return wStatus;
    }

    public void setwStatus(Integer wStatus) {
        this.wStatus = wStatus;
    }

    public Date getwWithdrawalsTime() {
        return wWithdrawalsTime;
    }

    public void setwWithdrawalsTime(Date wWithdrawalsTime) {
        this.wWithdrawalsTime = wWithdrawalsTime;
    }
}
