package com.jdy.b2b.api.model.diy;

import com.jdy.b2b.api.common.BaseVO;

import java.math.BigDecimal;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/10/9 14:57
 */
public class OrderStaticsDTO extends BaseVO {
    
    private Integer num;
    private BigDecimal amount;

    public Integer getNum() {
        return num;
    }

    public void setNum(Integer num) {
        this.num = num;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}
