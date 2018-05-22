package com.jdy.b2b.web.pojo.withdrawals;


import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.util.Date;

/**
 * Created by yangcheng on 2017/9/8.
 */
@ApiModel
public class WithdrawalsQueryVo extends BaseVO {
    @ApiModelProperty(value="状态 0:处理中 1:已受理 2:已提现 3:已失败 4:已合并 5:已撤销")
    private Integer wStatus;
    @ApiModelProperty(value="最小账单日")
    private Date minWday;
    @ApiModelProperty(value="最大账单日")
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
