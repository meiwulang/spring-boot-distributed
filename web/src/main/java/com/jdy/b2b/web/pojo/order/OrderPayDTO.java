package com.jdy.b2b.web.pojo.order;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/9/25 16:31
 */
@ApiModel(description = "订单支付记录")
public class OrderPayDTO extends OrderPay {
    @ApiModelProperty(value = "相关账单")
    private Bill bill;

    public Bill getBill() {
        return bill;
    }

    public void setBill(Bill bill) {
        this.bill = bill;
    }
}
