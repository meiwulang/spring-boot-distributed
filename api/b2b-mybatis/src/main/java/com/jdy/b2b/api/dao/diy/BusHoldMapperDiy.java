package com.jdy.b2b.api.dao.diy;

import com.jdy.b2b.api.model.BusHold;
import com.jdy.b2b.api.model.Schedule;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/24 14:27
 */
@Mapper
public interface BusHoldMapperDiy {

    int insertBatch(List<BusHold> list);

    List<BusHold> listBusHolds();

    Schedule selectScheduleByHold(BusHold h);
}
