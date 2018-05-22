package com.jdy.b2b.api.model.diy;

import com.jdy.b2b.api.model.OrderPay;
import com.jdy.b2b.api.model.bill.Bill;
import com.jdy.b2b.api.model.orderOffline.OrderOffline;

import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/9/25 16:31
 */
public class OrderPayDTO extends OrderPay {
    private Bill bill;

    public Bill getBill() {
        return bill;
    }

    public void setBill(Bill bill) {
        this.bill = bill;
    }
}
