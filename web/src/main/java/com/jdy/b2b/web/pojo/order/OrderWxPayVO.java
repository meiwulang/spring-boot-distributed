package com.jdy.b2b.web.pojo.order;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.NotBlank;

import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/10/10 10:59
 */
@ApiModel(description = "微信支付回调vo")
public class OrderWxPayVO extends BaseVO {
    @ApiModelProperty(value = "订单编号")
    @NotNull
    @NotBlank
    private String orderNo;

    @NotNull
    @ApiModelProperty(value = "是否支付成功")
    private Boolean flag;

    @ApiModelProperty(value = "备注")
    private String remark;

    @ApiModelProperty(value = "微信交易单号")
    @NotNull
    @NotBlank
    private String transactionId;

    private BigDecimal toPay;

    public String getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(String orderNo) {
        this.orderNo = orderNo;
    }

    public Boolean getFlag() {
        return flag;
    }

    public void setFlag(Boolean flag) {
        this.flag = flag;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public BigDecimal getToPay() {
        return toPay;
    }

    public void setToPay(BigDecimal toPay) {
        this.toPay = toPay;
    }
}
