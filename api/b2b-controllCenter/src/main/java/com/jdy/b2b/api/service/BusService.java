package com.jdy.b2b.api.service;

import com.jdy.b2b.api.model.Bus;
import com.jdy.b2b.api.model.Schedule;
import com.jdy.b2b.api.model.diy.BusDTO;
import com.jdy.b2b.api.vo.schedule.BusInsertDTO;
import com.jdy.b2b.api.vo.schedule.BusLockDTO;
import com.jdy.b2b.api.vo.schedule.BusReserveDTO;

import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/24 10:33
 */
public interface BusService {

    /**
     * 搜索车辆，含座位预留信息
     */
    List<BusDTO> selectBusAndHoldsAndSold(Bus bus);

    /**
     * 添加车辆(返回新增的车辆id，逗号分隔)
     */
    String insertBus(BusInsertDTO bus);

    /**
     * 删除车辆
     */
    int deleteBus(Bus bus);

    /**
     * 更新车辆座位数
     */
    int updateBusSeat(Bus bus);

    void updateBusLockSeats(BusLockDTO bus);

    void updateBusReserveSeats(BusReserveDTO bus);

    void batchSaveBusDTOs(List<Schedule> schedules, List<BusDTO> busDTOS);
}
