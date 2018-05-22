package com.jdy.b2b.web.pojo.orderRefund;


import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

/**
 * Created by yangcheng on 2017/8/29.
 */
@ApiModel
public class OrderRefundUpdateVo extends BaseVO {
    @ApiModelProperty(value="线下退款id,不能为空")
    @NotNull(message="id不能为空!")
    private Long id;
    @ApiModelProperty("备注")
    private String orRemark;
    @ApiModelProperty("false:未退款 true:已退款")
    private Boolean orStauts;
    @ApiModelProperty("关联标签id")
    private Long orLabelId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrRemark() {
        return orRemark;
    }

    public void setOrRemark(String orRemark) {
        this.orRemark = orRemark;
    }

    public Boolean getOrStauts() {
        return orStauts;
    }

    public void setOrStauts(Boolean orStauts) {
        this.orStauts = orStauts;
    }

    public Long getOrLabelId() {
        return orLabelId;
    }

    public void setOrLabelId(Long orLabelId) {
        this.orLabelId = orLabelId;
    }
}
