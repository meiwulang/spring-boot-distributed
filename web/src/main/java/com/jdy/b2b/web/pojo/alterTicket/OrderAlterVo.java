package com.jdy.b2b.web.pojo.alterTicket;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;

/**
 * @Description
 * @Author yyf
 * @DateTime 2018/4/23 14:31
 */
@ApiModel(description = "确认改签")
public class OrderAlterVo extends BaseVO {

    @NotNull
    @ApiModelProperty(value = "改签记录id")
    private Long alterId;
    @NotNull
    @ApiModelProperty(value = "状态：1通过，2关闭")
    private Integer status;

    public Long getAlterId() {
        return alterId;
    }

    public void setAlterId(Long alterId) {
        this.alterId = alterId;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}
