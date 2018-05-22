package com.jdy.b2b.web.pojo.withdrawals;


import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.util.Date;

/**
 * Created by yangcheng on 2017/9/8.
 */
@ApiModel
public class WithdrawalsUpdateVo  extends BaseVO {
    @ApiModelProperty(value = "提现预警id")
    @NotNull(message = "id不能为空")
    private Long id;
    @ApiModelProperty(value = "状态 0:处理中 1:已受理 2:已提现 3:已失败 4:已合并 5:已撤销 ",hidden = true)
    @Min(value = 0,message = "状态最小为0")
    @Max(value = 5,message = "状态最大为5")
    private Integer wStatus;
    @ApiModelProperty(value = "请求提现时间",hidden = true)
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
