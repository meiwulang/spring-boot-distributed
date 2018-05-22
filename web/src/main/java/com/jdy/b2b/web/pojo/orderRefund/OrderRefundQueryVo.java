package com.jdy.b2b.web.pojo.orderRefund;


import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * Created by yangcheng on 2017/8/29.
 */
@ApiModel
public class OrderRefundQueryVo extends BaseVO {
    @ApiModelProperty(value="订单号")
    private String orOrderNo;
    @ApiModelProperty(value="支付方式 0:在线支付 1:信用支付")
    private Integer opPayMethod;
    @ApiModelProperty(value="false:未退款 true:已退款")
    private Boolean orStauts;
    //暂时用不到
    @ApiModelProperty(value="标签id",hidden = true)
    private Long orLabelId;
    @ApiModelProperty(value="分销商id",hidden = true)
    private Long orBuyerId;
    @ApiModelProperty(value="供应商id",hidden = true)
    private Long orSalerId;

    public Boolean getOrStauts() {
        return orStauts;
    }

    public void setOrStauts(Boolean orStauts) {
        this.orStauts = orStauts;
    }

    public Long getOrBuyerId() {
        return orBuyerId;
    }

    public void setOrBuyerId(Long orBuyerId) {
        this.orBuyerId = orBuyerId;
    }

    public Long getOrSalerId() {
        return orSalerId;
    }

    public void setOrSalerId(Long orSalerId) {
        this.orSalerId = orSalerId;
    }

    public Long getOrLabelId() {
        return orLabelId;
    }

    public void setOrLabelId(Long orLabelId) {
        this.orLabelId = orLabelId;
    }

    public String getOrOrderNo() {
        return orOrderNo;
    }

    public void setOrOrderNo(String orOrderNo) {
        this.orOrderNo = orOrderNo;
    }

    public Integer getOpPayMethod() {
        return opPayMethod;
    }

    public void setOpPayMethod(Integer opPayMethod) {
        this.opPayMethod = opPayMethod;
    }
}
