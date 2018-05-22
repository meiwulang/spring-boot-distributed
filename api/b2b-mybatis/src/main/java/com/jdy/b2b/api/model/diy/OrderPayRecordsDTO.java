package com.jdy.b2b.api.model.diy;

import com.jdy.b2b.api.model.Order;
import com.jdy.b2b.api.model.OrderCard;

import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/9/12 14:28
 */
public class OrderPayRecordsDTO extends Order {

    private List<OrderPayDTO> pays;
    private List<OrderCard> orderCards;

    public List<OrderPayDTO> getPays() {
        return pays;
    }

    public void setPays(List<OrderPayDTO> pays) {
        this.pays = pays;
    }

    public List<OrderCard> getOrderCards() {
        return orderCards;
    }

    public void setOrderCards(List<OrderCard> orderCards) {
        this.orderCards = orderCards;
    }
}
