package com.jdy.b2b.api.service.impl;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.diy.ScheduleMapperDiy;
import com.jdy.b2b.api.model.Schedule;
import com.jdy.b2b.api.model.alterTicket.OrderAlterQueryScheduleListDTO;
import com.jdy.b2b.api.model.alterTicket.OrderQueryScheduleByTicketVO;
import com.jdy.b2b.api.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Created by strict on 2018/5/2.
 */
@Service
public class ScheduleServiceImpl implements ScheduleService {
    @Autowired
    private ScheduleMapperDiy scheduleMapper;

    @Override
    public ResultBean getScheduleListByTicket(OrderQueryScheduleByTicketVO vo) {
        List<Schedule> list = scheduleMapper.selectScheduleListByTicket(vo);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
        if (list!= null && list.size()>0){
            Map<String,List<Schedule>> map = list.stream().collect(Collectors.toMap(time -> sdf.format(time.getsCalendar()),value ->{
                return new ArrayList<Schedule>(){
                    {add(value);}
                };
            },(left,right)->{
                left.addAll(right);
                return left;
            },HashMap<String,List<Schedule>>::new));
            List<OrderAlterQueryScheduleListDTO> queryScheduleListDTOS = new ArrayList<>();
            for (Map.Entry<String,List<Schedule>> kv : map.entrySet()){
                OrderAlterQueryScheduleListDTO dto = new OrderAlterQueryScheduleListDTO();
                dto.setDate(kv.getKey());
                dto.setScheduleList(kv.getValue());
                queryScheduleListDTOS.add(dto);
            }
            Collections.sort(queryScheduleListDTOS,Comparator.comparing(OrderAlterQueryScheduleListDTO::getDate));
            return ResultBean.getSuccessResult(queryScheduleListDTOS);
        }
        return ResultBean.getSuccessResult();
    }
}
