package com.jdy.b2b.web.pojo.order;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/9/23 14:32
 */
@ApiModel(description = "订单取消vo")
public class OrderCancelVO extends BaseVO {
    @ApiModelProperty(value = "true：卖家；false：买家")
    @NotNull
    private Boolean isSaler;

    @ApiModelProperty(value = "订单id")
    private Long orderId;

    @ApiModelProperty(value = "违约金")
    @Min(0)
    private BigDecimal money;

    @ApiModelProperty(value = "取消备注")
    @NotNull
    private String remark;

    @ApiModelProperty(value = "订单编号")
    @NotNull
    private String oOrderNo;

    public Boolean getSaler() {
        return isSaler;
    }

    public void setSaler(Boolean saler) {
        isSaler = saler;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public BigDecimal getMoney() {
        return money;
    }

    public void setMoney(BigDecimal money) {
        this.money = money;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getoOrderNo() {
        return oOrderNo;
    }

    public void setoOrderNo(String oOrderNo) {
        this.oOrderNo = oOrderNo;
    }
}
