package com.jdy.b2b.api.model.diy;

import com.jdy.b2b.api.model.OrderPriceDetail;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/10/27 21:35
 */
public class OrderPriceDetailVO extends OrderPriceDetail {
    private Integer roomNum;

    public Integer getRoomNum() {
        return roomNum;
    }

    public void setRoomNum(Integer roomNum) {
        this.roomNum = roomNum;
    }
}
