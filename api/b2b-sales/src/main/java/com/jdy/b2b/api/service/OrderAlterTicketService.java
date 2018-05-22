package com.jdy.b2b.api.service;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.Order;
import com.jdy.b2b.api.model.alterTicket.OrderAlterTicketRecord;
import com.jdy.b2b.api.model.alterTicket.OrderAlterTicketWithTouristDTO;
import com.jdy.b2b.api.model.alterTicket.OrderAlterVo;
import com.jdy.b2b.api.model.diy.OrderDetailDTO;

/**
 * Created by strict on 2018/4/20.
 */
public interface OrderAlterTicketService {

    ResultBean getAlterTicketList(OrderAlterTicketRecord vo);

    ResultBean changeTicket(OrderAlterVo vo);

    ResultBean getAlterTicketRecord(Long alterId);

    ResultBean applyAlterTicketRecord(OrderAlterTicketWithTouristDTO vo);

    Order genNegOrder(Order o, OrderDetailDTO orderDetail);
}
