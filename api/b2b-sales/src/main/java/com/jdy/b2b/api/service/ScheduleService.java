package com.jdy.b2b.api.service;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.alterTicket.OrderQueryScheduleByTicketVO;

/**
 * Created by strict on 2018/5/2.
 */
public interface ScheduleService {


    ResultBean getScheduleListByTicket(OrderQueryScheduleByTicketVO vo);
}
