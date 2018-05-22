package com.jdy.b2b.api.service;

import com.jdy.b2b.api.model.Schedule;
import com.jdy.b2b.api.model.diy.*;
import com.jdy.b2b.api.model.front.ProductScheduleDto;
import com.jdy.b2b.api.model.front.ScheduleCalendarRequestParam;
import com.jdy.b2b.api.model.front.ScheduleListRequestParam;
import com.jdy.b2b.api.model.scheduleGroup.ScheduleGuestDO;
import com.jdy.b2b.api.model.scheduleplan.ScheduleManagerDO;
import com.jdy.b2b.api.model.scheduleplan.ScheduleManagerQueryDTO;
import com.jdy.b2b.api.model.scheduleplan.ScheduleTouristsDO;
import com.jdy.b2b.api.model.scheduleplan.ScheduleTouristsQueryDTO;
import com.jdy.b2b.api.model.station.Departure;
import com.jdy.b2b.api.vo.schedule.ScheduleSaveVO;
import com.jdy.b2b.api.vo.schedule.ScheduleUpdateVO;

import java.text.ParseException;
import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/18 14:38
 */
public interface ScheduleService {

    List<ScheduleDTO> selectScheduleList(ScheduleQuery scheduleQuery);

    ScheduleWithTicketsDTO selectScheduleWithTickets(Long id,Integer flag);

    List<Long> batchSaveScheduleInfo(ScheduleSaveVO scheduleSaveVO) throws ParseException;

    void updateScheduleInfo(ScheduleUpdateVO vo);

    void clearCustomScheduleTickets(Long id);

    List<ProductScheduleDto> selectProductScheduleList(ScheduleListRequestParam param);

    List<ProductScheduleDto> selectScheduleCalendarList(ScheduleCalendarRequestParam param);

    List<DepartureWithStopsDTO> selectDeparturesWithStops(ScheduleDepartsSearchVO vo);

    List<Departure> selectDepartures(ScheduleDepartsSearchVO vo);

    void createSGroupOrderNo();

    List<ScheduleGuestDO> guestList(Long productId);

    List<ScheduleManagerDO> queryScheduleManagerList(ScheduleManagerQueryDTO scheduleManagerQueryDTO);

    List<ScheduleTouristsDO> queryTouristsListByScheduleId(ScheduleTouristsQueryDTO scheduleTouristsQueryDTO);

    int updateByPrimaryKeySelective(Schedule s);

    Schedule selectByPrimaryKey(Long id);
}
