package com.jdy.b2b.web.pojo.transfer;



import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.util.Date;
@ApiModel
public class TransferUpdateVo extends BaseVO {
    @NotNull(message = "转账id不能为空")
    @ApiModelProperty(value="转账id")
    private Long id;
    @ApiModelProperty(value="失败原因",hidden = true)
    private String tFailReason;
    @ApiModelProperty(value="转账时间",hidden = true)
    private Date tTransferTime;
    @ApiModelProperty(value="转账完成时间",hidden = true)
    private Date tConfrimTime;
    @ApiModelProperty(value="状态 0:已失败 1:处理中 2:已转账 3:已撤销",hidden = true)
    @Min(value=0,message = "状态最小为0")
    @Max(value=3,message = "状态最大为3")
    private Integer tStatus;

    public String gettFailReason() {
        return tFailReason;
    }

    public void settFailReason(String tFailReason) {
        this.tFailReason = tFailReason;
    }

    public Date gettTransferTime() {
        return tTransferTime;
    }

    public void settTransferTime(Date tTransferTime) {
        this.tTransferTime = tTransferTime;
    }

    public Date gettConfrimTime() {
        return tConfrimTime;
    }

    public void settConfrimTime(Date tConfrimTime) {
        this.tConfrimTime = tConfrimTime;
    }

    public Integer gettStatus() {
        return tStatus;
    }

    public void settStatus(Integer tStatus) {
        this.tStatus = tStatus;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}