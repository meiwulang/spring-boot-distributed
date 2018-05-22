package com.jdy.b2b.api.dao.diy;

import com.jdy.b2b.api.model.Order;
import com.jdy.b2b.api.model.Schedule;
import com.jdy.b2b.api.model.alterTicket.OrderQueryScheduleByTicketVO;
import com.jdy.b2b.api.model.diy.DepartureWithStopsDTO;
import com.jdy.b2b.api.model.diy.ScheduleDTO;
import com.jdy.b2b.api.model.diy.ScheduleDepartsSearchVO;
import com.jdy.b2b.api.model.diy.ScheduleQuery;
import com.jdy.b2b.api.model.station.Departure;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/18 10:23
 */
@Mapper
public interface ScheduleMapperDiy {

    List<ScheduleDTO> selectScheduleList(ScheduleQuery scheduleQuery);

    int insertBatch(List<Schedule> list);

    List<Order> selectSoldSeats(Long scheduleId);

    int updateScheduleSeatSold(Map sch);

    List<DepartureWithStopsDTO> selectDeparturesWithStops(ScheduleDepartsSearchVO vo);

    List<Departure> selectDepartures(ScheduleDepartsSearchVO vo);

    List<Schedule> selectScheduleListByTicket(OrderQueryScheduleByTicketVO vo);
}
