package com.jdy.b2b.api.service.impl;

import com.jdy.b2b.api.common.BaseService;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.common.StringUtils;
import com.jdy.b2b.api.dao.OrderMapper;
import com.jdy.b2b.api.dao.OrderPriceDetailMapper;
import com.jdy.b2b.api.dao.OrderTouristMapper;
import com.jdy.b2b.api.dao.ScheduleMapper;
import com.jdy.b2b.api.dao.diy.OrderMapperDiy;
import com.jdy.b2b.api.dao.diy.ScheduleTicketMapperDiy;
import com.jdy.b2b.api.dao.ticket.TicketMapper;
import com.jdy.b2b.api.model.Order;
import com.jdy.b2b.api.model.OrderTourist;
import com.jdy.b2b.api.model.TouristCancelVO;
import com.jdy.b2b.api.model.ticket.Ticket;
import com.jdy.b2b.api.service.OrderTouristService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by strict on 2018/1/30.
 */
@Service
public class OrderTouristServiceImpl extends BaseService implements OrderTouristService {

    @Autowired
    private OrderTouristMapper orderTouristMapper;
    @Autowired
    private TicketMapper ticketMapper;
    @Autowired
    private OrderMapperDiy orderMapperDiy;
    @Autowired
    private OrderMapper orderMapper;
    @Autowired
    private ScheduleMapper scheduleMapper;
    @Autowired
    private OrderPriceDetailMapper orderPriceDetailMapper;
    @Autowired
    private ScheduleTicketMapperDiy scheduleTicketMapperDiy;

    @Override
    @Transactional
    public ResultBean batchCancelTourist(TouristCancelVO touristCancelVO) {
        if (touristCancelVO.getTouristIds() == null || touristCancelVO.getTouristIds().size() == 0){
            return new ResultBean("0","未选择客人");
        }
        if (StringUtils.isNullOrEmptyStr(touristCancelVO.getRemark())){
            return new ResultBean("-1","请传取消原因");
        }
        int i = orderTouristMapper.updateCancelTourist(touristCancelVO);
        if (i > 0){
            return reduce(touristCancelVO.getTouristIds().get(0));
        }else{
            return ResultBean.getErrorResult("取消客人失败");
        }
    }

    /**
     * 取消游客后做相应的减少
     * @param touristId
     */
    private ResultBean reduce(Long touristId){
        OrderTourist tourist = orderTouristMapper.selectByPrimaryKey(touristId);
        //游客对应的票
        Ticket ticket = ticketMapper.selectByIdOnly(tourist.getOtTicketId());
        //对应的订单
        Order order = orderMapper.selectByPrimaryKey(tourist.getOtOrderId());
        //订单中 people_num 减少
        Integer reduceNum = ticket.gettAdultNum()+ticket.gettChildNum();
        int flag1 = orderMapperDiy.updatePeopleNumById(tourist.getOtOrderId(),reduceNum);
        //班期中的库存恢复
        List<Map>  schTk = new ArrayList<>();
        Map map = new HashMap<>();
        map.put("stockChange",-1);
        map.put("scheduleId",order.getoScheduleId());
        map.put("ticketId",ticket.getId());
        schTk.add(map);
        int flag2 = scheduleTicketMapperDiy.updateTicketStock(schTk);
        //order_price_detail 中票数减少
        int flag3 = orderPriceDetailMapper.updateNumById(order.getId(), ticket.getId(), 1);
        if (flag1>0 && flag2>0 && flag3>0){
            return ResultBean.getSuccessResult();
        }else{
            logger.info("更新 people_num:"+(flag1>0) +" 更新班期库存:"+(flag2>0) +" 更新order_price_detail 表票数:"+(flag3>0));
            return ResultBean.getErrorResult("更新库存等信息时出错");
        }
    }


}
