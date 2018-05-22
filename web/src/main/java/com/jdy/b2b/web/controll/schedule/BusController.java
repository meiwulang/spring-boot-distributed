package com.jdy.b2b.web.controll.schedule;

import com.jdy.b2b.web.pojo.schedule.*;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;
import com.jdy.b2b.web.util.exception.ParamUnExpectException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/8/1 15:20
 */
@Api(value = "Bus", description = "班期车辆")
@RestController
@RequestMapping("Bus")
public class BusController extends BaseController {

    @Value("${controllCenterUrl}Bus")
    String MODULE_URL;

    @ApiOperation("搜索车辆，含座位预留信息")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "班期车辆信息", response = BusWithHoldsDTO.class)})
    @PostMapping("/selectBus")
    public ResultBean selectBus(@Validated @RequestBody ScheduleBusesQO dto) {
        return restTemplate.postForObject(MODULE_URL + "/selectBus", dto, ResultBean.class);
    }

    @ApiOperation("添加车辆")
    @PostMapping("/insertBus")
    public ResultBean insertBus(@Validated @RequestBody BusAddDTO dto) {
        return restTemplate.postForObject(MODULE_URL + "/insertBus", dto, ResultBean.class);
    }

    @ApiOperation("删除车辆")
    @PostMapping("/deleteBus")
    public ResultBean deleteBus(@Validated @RequestBody BusDeleteDTO dto) {
        return restTemplate.postForObject(MODULE_URL + "/deleteBus", dto, ResultBean.class);
    }

    @ApiOperation("更新车辆座位数")
    @PostMapping("/updateSeat")
    public ResultBean updateSeat(@Validated @RequestBody BusChangeSeatNumDTO dto) {
        return restTemplate.postForObject(MODULE_URL + "/updateSeat", dto, ResultBean.class);
    }

    @ApiOperation("车辆锁定、解锁座位")
    @PostMapping("/updateLock")
    public ResultBean updateLock(@Validated @RequestBody BusLockDTO dto) {
        validateSeats(dto.getbSeatsLock());
        return restTemplate.postForObject(MODULE_URL + "/updateLock", dto, ResultBean.class);
    }

    @ApiOperation("车辆预留、释放座位")
    @PostMapping("/updateReserve")
    public ResultBean updateReserve(@Validated @RequestBody BusReserveDTO dto) {
        validateSeats(dto.getbSeat());
        if (dto.getReserve() && dto.getbHoldHours() == null) {
            return new ResultBean("-1", "预留时间不能为空！");
        }
        return restTemplate.postForObject(MODULE_URL + "/updateReserve", dto, ResultBean.class);
    }

    /**
     * 初步校验座位号
     */
    private void validateSeats(String seats) {
        if (StringUtils.isBlank(seats)) {
            return;
        }
        String[] seatsArr = StringUtils.split(seats, ',');
        Set<Integer> seatSet = Arrays.stream(seatsArr).mapToInt(Integer::valueOf).boxed().collect(Collectors.toSet());
        if (seatsArr.length != seatSet.size()) {
            throw new ParamUnExpectException("锁定保留座位号存在重复！");
        }
    }

}
