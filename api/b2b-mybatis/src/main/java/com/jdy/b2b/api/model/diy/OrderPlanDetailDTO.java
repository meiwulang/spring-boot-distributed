package com.jdy.b2b.api.model.diy;

import com.jdy.b2b.api.model.Order;

import java.util.List;

/**
 * @Description 计划详情
 * @Author yyf
 * @DateTime 2017/9/13 13:48
 */
public class OrderPlanDetailDTO extends Order {

    private List<OrderTouristDTO> tourists;

    public List<OrderTouristDTO> getTourists() {
        return tourists;
    }

    public void setTourists(List<OrderTouristDTO> tourists) {
        this.tourists = tourists;
    }
}
