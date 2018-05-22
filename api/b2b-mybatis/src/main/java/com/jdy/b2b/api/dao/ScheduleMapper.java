package com.jdy.b2b.api.dao;

import com.jdy.b2b.api.model.Schedule;
import com.jdy.b2b.api.model.ScheduleNumDTO;
import com.jdy.b2b.api.model.front.ProductScheduleDto;
import com.jdy.b2b.api.model.front.ScheduleCalendarRequestParam;
import com.jdy.b2b.api.model.front.ScheduleListRequestParam;
import com.jdy.b2b.api.model.scheduleGroup.ScheduleGuestDO;
import com.jdy.b2b.api.model.scheduleplan.*;
import com.jdy.b2b.api.model.user.UserNoDTO;
import org.apache.ibatis.annotations.MapKey;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface ScheduleMapper {
    int deleteByPrimaryKey(Long id);

    int insert(Schedule record);

    int insertSelective(Schedule record);

    Schedule selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Schedule record);
    
    int updateByProductSelective(@Param("productId") Long productId,@Param("day")Integer day );

    int updateByPrimaryKey(Schedule record);

    List<ProductScheduleDto> selectProductScheduleList(ScheduleListRequestParam param);

    List<ProductScheduleDto> selectScheduleCalendarList(ScheduleCalendarRequestParam param);

    @MapKey("date")
    Map<String,ScheduleNumDTO> selectExistNumByDate(@Param("cals") List<String> cals);

    List<CreateGroupOrderDTO> selectNoGroupOrderNoSch();

    int batchUpdateGroupOrderNo(@Param("list") List<Schedule> updateList);

    int updateGroupOrderNoBash(@Param("list") List<UserNoDTO> list);

    List<UserNoDTO> selectOldSchIdNOList();

    List<ScheduleGuestDO> guestList(@Param("id") Long id);

    List<ScheduleManagerDO> selectScheduleManagerList(ScheduleManagerQueryDTO scheduleManagerQueryDTO);

    List<ScheduleTouristsDO> selectTouristsListByScheduleId(ScheduleTouristsQueryDTO scheduleTouristsQueryDTO);

    int updateSeatSoldById(@Param("scheduleId") Long scheduleId,@Param("reduceNum") Integer reduceNum);
}