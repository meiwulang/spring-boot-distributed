package com.jdy.b2b.api.vo.withdrawals;

import com.jdy.b2b.api.common.BaseVO;

import java.util.Date;

/**
 * Created by yangcheng on 2017/9/8.
 */
public class WithdrawalsQueryVo extends BaseVO{
    private Integer wStatus;
    private Date minWday;
    private Date maxWday;

    public Integer getwStatus() {
        return wStatus;
    }

    public void setwStatus(Integer wStatus) {
        this.wStatus = wStatus;
    }

    public Date getMinWday() {
        return minWday;
    }

    public void setMinWday(Date minWday) {
        this.minWday = minWday;
    }

    public Date getMaxWday() {
        return maxWday;
    }

    public void setMaxWday(Date maxWday) {
        this.maxWday = maxWday;
    }
}
