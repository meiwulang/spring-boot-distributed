package com.jdy.b2b.api.model.diy;

import com.jdy.b2b.api.common.BaseVO;

import java.util.List;

/**
 * @Description 订单列表返回对象
 * @Author yyf
 * @DateTime 2017/8/30 11:07
 */
public class OrderSearchDTO extends BaseVO {

    public OrderSearchDTO() {
    }

    public OrderSearchDTO(List<OrderListDTO> orders) {
        this.orders = orders;
    }

    private List<OrderListDTO> orders;

    public List<OrderListDTO> getOrders() {
        return orders;
    }

    public void setOrders(List<OrderListDTO> orders) {
        this.orders = orders;
    }
}
