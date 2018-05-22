package com.jdy.b2b.api.controller;

import com.jdy.b2b.api.common.BaseController;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.Bus;
import com.jdy.b2b.api.model.diy.BusDTO;
import com.jdy.b2b.api.service.BusService;
import com.jdy.b2b.api.vo.schedule.BusInsertDTO;
import com.jdy.b2b.api.vo.schedule.BusLockDTO;
import com.jdy.b2b.api.vo.schedule.BusReserveDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.reflect.InvocationTargetException;
import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/25 15:55
 */
@RestController
@RequestMapping("Bus")
public class BusController extends BaseController {

    @Autowired
    BusService busService;

    /**
     * 搜索车辆，含座位预留信息
     */
    @PostMapping("/selectBus")
    public ResultBean selectBusAndHolds(@RequestBody Bus bus) {
        List<BusDTO> list = busService.selectBusAndHoldsAndSold(bus);
        return ResultBean.getSuccessResult(list);
    }

    /**
     * 添加车辆(返回新增的车辆id，逗号分隔)
     */
    @PostMapping("/insertBus")
    public ResultBean insertBus(@RequestBody BusInsertDTO bus) throws IllegalAccessException, NoSuchMethodException, InvocationTargetException {
        String res = busService.insertBus(bus);
        return ResultBean.getSuccessResult(res);
    }

    /**
     * 删除车辆
     */
    @PostMapping("/deleteBus")
    public ResultBean deleteBus(@RequestBody Bus bus) {
        busService.deleteBus(bus);
        return ResultBean.getSuccessResult();
    }

    /**
     * 更新车辆座位数
     */
    @PostMapping("/updateSeat")
    public ResultBean updateBusSeat(@RequestBody Bus bus) {
        busService.updateBusSeat(bus);
        return ResultBean.getSuccessResult();
    }

    /**
     * 锁定、解锁
     */
    @PostMapping("/updateLock")
    public ResultBean updateBusLockSeats(@RequestBody BusLockDTO bus) {
        busService.updateBusLockSeats(bus);
        return ResultBean.getSuccessResult();
    }

    /**
     * 预留、释放
     */
    @PostMapping("/updateReserve")
    public ResultBean updateBusReserveSeats(@RequestBody BusReserveDTO bus) {
        busService.updateBusReserveSeats(bus);
        return ResultBean.getSuccessResult();
    }
}
