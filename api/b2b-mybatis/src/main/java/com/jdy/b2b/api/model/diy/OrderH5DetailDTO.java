package com.jdy.b2b.api.model.diy;

import com.jdy.b2b.api.model.OrderCard;
import com.jdy.b2b.api.model.OrderContract;

import java.util.List;

/**
 * Created by strict on 2017/9/26.
 */
public class OrderH5DetailDTO  {
    private OrderH5DTO order_detail;
    private List<SeatDetailH5DTO> seat_detail;
    private List<PayDetailH5DTO> pay_detail;
    private OrderContract orderContract;
    private List<OrderCard> orderCards;

    public OrderH5DTO getOrder_detail() {
        return order_detail;
    }

    public void setOrder_detail(OrderH5DTO order_detail) {
        this.order_detail = order_detail;
    }

    public List<SeatDetailH5DTO> getSeat_detail() {
        return seat_detail;
    }

    public void setSeat_detail(List<SeatDetailH5DTO> seat_detail) {
        this.seat_detail = seat_detail;
    }

    public List<PayDetailH5DTO> getPay_detail() {
        return pay_detail;
    }

    public void setPay_detail(List<PayDetailH5DTO> pay_detail) {
        this.pay_detail = pay_detail;
    }

    public OrderContract getOrderContract() {
        return orderContract;
    }

    public void setOrderContract(OrderContract orderContract) {
        this.orderContract = orderContract;
    }

    public List<OrderCard> getOrderCards() {
        return orderCards;
    }

    public void setOrderCards(List<OrderCard> orderCards) {
        this.orderCards = orderCards;
    }
}
