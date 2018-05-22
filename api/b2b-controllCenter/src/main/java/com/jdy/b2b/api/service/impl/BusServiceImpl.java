package com.jdy.b2b.api.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.jdy.b2b.api.common.BaseService;
import com.jdy.b2b.api.dao.BusHoldMapper;
import com.jdy.b2b.api.dao.BusMapper;
import com.jdy.b2b.api.dao.diy.BusHoldMapperDiy;
import com.jdy.b2b.api.dao.diy.BusMapperDiy;
import com.jdy.b2b.api.dao.diy.BusMapperExtDiy;
import com.jdy.b2b.api.model.Bus;
import com.jdy.b2b.api.model.BusHold;
import com.jdy.b2b.api.model.Schedule;
import com.jdy.b2b.api.model.diy.BusDTO;
import com.jdy.b2b.api.model.diy.BusHoldDTO;
import com.jdy.b2b.api.service.BusService;
import com.jdy.b2b.api.service.ScheduleService;
import com.jdy.b2b.api.vo.schedule.BusInsertDTO;
import com.jdy.b2b.api.vo.schedule.BusLockDTO;
import com.jdy.b2b.api.vo.schedule.BusReserveDTO;
import org.apache.commons.collections.ListUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Supplier;
import java.util.stream.Collectors;

import static org.apache.commons.collections.CollectionUtils.containsAny;
import static org.apache.commons.collections.CollectionUtils.isEmpty;
import static org.apache.commons.lang3.StringUtils.*;
import static org.apache.commons.lang3.time.DateUtils.addHours;
import static org.springframework.beans.BeanUtils.copyProperties;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/24 10:36
 */
@Service
public class BusServiceImpl extends BaseService implements BusService {

    @Autowired
    BusMapper busMapper;
    @Autowired
    BusMapperDiy busMapperDiy;
    @Autowired
    BusHoldMapper busHoldMapper;
    @Autowired
    BusHoldMapperDiy busHoldMapperDiy;
    @Autowired
    ScheduleService scheduleService;
    @Autowired
    BusMapperExtDiy busMapperExtDiy;

    @Override
    public List<BusDTO> selectBusAndHoldsAndSold(Bus bus) {
        return busMapperExtDiy.selectBusAndHoldsAndSold(bus);
    }

    /**
     * 添加车辆
     */
    @Transactional
    @Override
    public String insertBus(BusInsertDTO bus) {
        Schedule schedule = scheduleService.selectByPrimaryKey(bus.getbScheduleId());
        if (schedule == null) {
            throw new RuntimeException("未找到指定班期信息！");
        }

        List<Bus> list = busMapperDiy.selectBusList(bus);
        int no = 1;
        // 设置车号
        if (!isEmpty(list)) {
            Bus tail = list.get(list.size() - 1);
            no = tail.getbNo() + 1;
        }
        bus.setbStatus(0);

        String ids;
        int res;
        if (bus.getNum() > 1) {
            List<Bus> buses = new ArrayList<>(bus.getNum());
            for (int i = 0; i < bus.getNum(); i++) {
                Bus b = new Bus();
                copyProperties(bus, b);
                b.setbNo(no++);
                buses.add(b);
            }
            List<BusDTO> newBuses = buses.stream().map(BusDTO::new).collect(Collectors.toList());
            res = busMapperDiy.insertBatch(newBuses);
            if (res != newBuses.size()) {
                throw new RuntimeException("保存车辆信息失败！");
            }
            ids = newBuses.stream().map(BusDTO::getId).map(String::valueOf).collect(Collectors.joining(","));
        } else {
            bus.setbNo(no);
            res = busMapper.insertSelective(bus);
            if (res != 1) {
                throw new RuntimeException("保存车辆信息失败！");
            }
            ids = bus.getId().toString();
        }

        Schedule s = new Schedule();
        s.setId(schedule.getId());
        if (bus.getNum() > 1) {
            s.setsCarNum(schedule.getsCarNum() + bus.getNum());
            s.setsSeatTotal(schedule.getsSeatTotal() + bus.getNum() * bus.getbSeatsNum());
        } else {
            s.setsCarNum(schedule.getsCarNum() + 1);
            s.setsSeatTotal(schedule.getsSeatTotal() + bus.getbSeatsNum());
        }
        int i = scheduleService.updateByPrimaryKeySelective(s);
        if (i != 1) {
            throw new RuntimeException("更新班期车辆数目出错了！");
        } else {
            return ids;
        }
    }

    /**
     * 删除车辆
     */
    @Transactional
    @Override
    public int deleteBus(Bus bus) {
        Bus nb = new Bus();
        nb.setbScheduleId(bus.getbScheduleId());
        List<BusDTO> list = selectBusAndHoldsAndSold(nb);
        if (isEmpty(list) || list.stream().filter(busDTO -> busDTO.getId().equals(bus.getId())).count() != 1) {
            throw new RuntimeException("找不到车辆信息！");
        }
        if (list.size() == 1) {
            throw new RuntimeException("必须存在一辆车！");
        }
        Schedule schedule = scheduleService.selectByPrimaryKey(list.get(0).getbScheduleId());
        if (schedule == null) {
            throw new RuntimeException("找不到指定班期信息！");
        }

        // 当前车辆或者编号更大的车辆不能有锁定、预留或者售出的位置
        long l = list.stream().filter(b -> b.getId() >= bus.getId()).filter(b -> !isEmpty(getOperSeats(b.getbSeatsLock()))
                || !isEmpty(getOperSeats(b.getBusHolds().stream().filter(h -> isNotBlank(h.getbSeat())).map(BusHold::getbSeat).reduce((s, s2) -> s + ',' + s2).orElse("")))
                || !isEmpty(getOperSeats(b.getSeatsSold()))).count();
        if (l > 0) {
            throw new RuntimeException("您删除的车辆之后含有被锁定、预留或者售出座位的车辆，不能删除！");
        }

        int busSeat = 0;
        for (Bus b : list) {
            if (b.getId().equals(bus.getId())) {
                busSeat = b.getbSeatsNum();
                // 指定车辆状态设置为1:无效
                Bus bs = new Bus();
                bs.setId(b.getId());
                bs.setbStatus(1);
                int i = busMapper.updateByPrimaryKeySelective(bs);
                if (i != 1) {
                    throw new RuntimeException("更新车辆状态失败！");
                }
            } else if (b.getId() > bus.getId()) {
                // 更新后面的车辆编号
                Bus bs = new Bus();
                bs.setId(b.getId());
                bs.setbNo(b.getbNo() - 1);
                int i = busMapper.updateByPrimaryKeySelective(bs);
                if (i != 1) {
                    throw new RuntimeException("更新车辆编号失败！");
                }
            }
        }

        Schedule s = new Schedule();
        s.setId(schedule.getId());
        s.setsCarNum(schedule.getsCarNum() - 1);
        s.setsSeatTotal(schedule.getsSeatTotal() - busSeat);
        int i = scheduleService.updateByPrimaryKeySelective(s);
        if (i == 1) {
            return i;
        } else {
            throw new RuntimeException("更新班期座位数出错了！");
        }
    }

    /**
     * 更新车辆座位数
     */
    @Transactional
    @Override
    public int updateBusSeat(Bus bus) {
        List<BusDTO> buses = selectBusAndHoldsAndSold(bus);
        if (isEmpty(buses)) {
            throw new RuntimeException("找不到指定id为【" + bus.getId() + "】的有效车辆信息!");
        }
        TreeSet<Integer> seats = getLockedAndReservedAndSoldSeats(buses);
        if (!isEmpty(seats)) {
            if (bus.getbSeatsNum() < seats.last()) {
                throw new RuntimeException(seats.last() + "号座位已经被预留、锁定或售出！");
            }
        }

        Bus b = buses.get(0);
        Schedule schedule = scheduleService.selectByPrimaryKey(b.getbScheduleId());
        if (schedule == null) {
            throw new RuntimeException("未找到对应的班期信息！");
        }

        // 更新车辆座位
        Bus ub = new Bus();
        ub.setId(bus.getId());
        ub.setbSeatsNum(bus.getbSeatsNum());
        int i = busMapper.updateByPrimaryKeySelective(ub);
        if (i != 1) {
            throw new RuntimeException("更新车辆座位数出错了！");
        }

        // 更新车辆总座位数
        Schedule s = new Schedule();
        s.setId(schedule.getId());
        s.setsSeatTotal(schedule.getsSeatTotal() - b.getbSeatsNum() + bus.getbSeatsNum());
        i = scheduleService.updateByPrimaryKeySelective(s);
        if (i == 1) {
            return i;
        } else {
            throw new RuntimeException("更新班期座位数出错了！！");
        }

    }

    /**
     * 锁定、解锁车辆位置
     */
    @Transactional
    @Override
    public void updateBusLockSeats(BusLockDTO bus) {
        Bus b = new Bus();
        b.setId(bus.getId());
        List<BusDTO> buses = selectBusAndHoldsAndSold(b);
        if (isEmpty(buses)) {
            throw new RuntimeException("找不到指定id为【" + bus.getId() + "】的有效车辆信息!");
        }
        Schedule schedule = scheduleService.selectByPrimaryKey(buses.get(0).getbScheduleId());
        if (schedule == null) {
            throw new RuntimeException("未找到对应的班期信息！");
        }
        TreeSet<Integer> seats = getLockedAndReservedAndSoldSeats(buses);
        List<Integer> seatLocked = getOperSeats(buses.get(0).getbSeatsLock());
        List<Integer> operSeats = getOperSeats(bus.getbSeatsLock());
        // 锁定
        if (bus.getLock()) {
            if (containsAny(seats, operSeats)) {
                throw new RuntimeException("下列位置已预留、锁定或售出：" + JSON.toJSONString(seats));
            } else if (operSeats.stream().filter(i -> i > buses.get(0).getbSeatsNum()).count() > 0) {
                throw new RuntimeException("座位号不能大于车辆座位数：" + buses.get(0).getbSeatsNum());
            }
            seatLocked.addAll(operSeats);
        }
        // 解锁
        else if (!bus.getLock()) {
            if (!seatLocked.containsAll(operSeats)) {
                throw new RuntimeException("不能解锁未锁定的座位号！已锁定的为：" + JSON.toJSONString(seatLocked));
            }
            seatLocked.removeAll(operSeats);
        }

        // 更新车辆锁定座位
        Bus ub = new Bus();
        ub.setId(bus.getId());
        ub.setbSeatsLock(join(seatLocked.iterator(), ","));
        int i = busMapper.updateByPrimaryKeySelective(ub);
        if (i != 1) {
            throw new RuntimeException("更新车辆锁定座位出错了！");
        }

        // 更新车辆总座位数
        Schedule s = new Schedule();
        s.setId(schedule.getId());
        if (bus.getLock()) {
            s.setsSeatLock(schedule.getsSeatLock() + operSeats.size());
        } else {
            s.setsSeatLock(schedule.getsSeatLock() - operSeats.size());
        }
        i = scheduleService.updateByPrimaryKeySelective(s);
        if (i != 1) {
            throw new RuntimeException("更新班期锁定座位数出错了！！");
        }
    }

    /**
     * 预留、释放车辆位置
     */
    @Transactional
    @Override
    public void updateBusReserveSeats(BusReserveDTO bus) {
        Bus b = new Bus();
        b.setId(bus.getbBusId());
        List<BusDTO> buses = selectBusAndHoldsAndSold(b);
        if (isEmpty(buses)) {
            throw new RuntimeException("找不到指定id为【" + bus.getbBusId() + "】的有效车辆信息!");
        }
        Schedule schedule = scheduleService.selectByPrimaryKey(buses.get(0).getbScheduleId());
        if (schedule == null) {
            throw new RuntimeException("未找到对应的班期信息！");
        }
        TreeSet<Integer> seats = getLockedAndReservedAndSoldSeats(buses);
        List<Integer> operSeats = getOperSeats(bus.getbSeat());
        // 预留
        if (bus.getReserve()) {
            if (containsAny(seats, operSeats)) {
                throw new RuntimeException("下列位置已预留、锁定或售出：" + JSON.toJSONString(seats));
            } else if (operSeats.stream().filter(i -> i > buses.get(0).getbSeatsNum()).count() > 0) {
                throw new RuntimeException("座位号不能大于车辆座位数：" + buses.get(0).getbSeatsNum());
            }

            // 存在该账号预留记录
            List<BusHoldDTO> holds = buses.get(0).getBusHolds();
            Optional<BusHoldDTO> holdOptional = Optional.empty();
            if (!isEmpty(holds)) {
                holdOptional = holds.stream().filter(h -> (h.getbCompanyId().equals(bus.getbCompanyId()) && h.getbAccount().equals(bus.getbAccount()))).findFirst();
                if (holdOptional.isPresent()) {
                    BusHold hold = holdOptional.get();
                    List<Integer> reserved = getOperSeats(hold.getbSeat());
                    reserved.addAll(operSeats);
                    BusHold updateHold = new BusHold();
                    updateHold.setId(hold.getId());
                    updateHold.setbSeat(join(reserved.iterator(), ","));
                    updateHold.setbHoldHours(bus.getbHoldHours());
                    int i = busHoldMapper.updateByPrimaryKeySelective(updateHold);
                    if (i != 1) {
                        throw new RuntimeException("更新车辆座位预留信息失败！");
                    }
                }
            }

            if (isEmpty(holds) || !holdOptional.isPresent()) {
                // 不存在该账号预留记录
                BusHold updateHold = new BusHold();
                updateHold.setbBusId(bus.getbBusId());
                updateHold.setbCompanyId(bus.getbCompanyId());
                updateHold.setbAccount(bus.getbAccount());
                updateHold.setbSeat(join(operSeats.iterator(), ","));
                updateHold.setbHoldHours(bus.getbHoldHours());
                int i = busHoldMapper.insert(updateHold);
                if (i != 1) {
                    throw new RuntimeException("保存车辆座位预留信息失败！");
                }
            }
        }
        // 释放
        else if (!bus.getReserve()) {
            List<BusHoldDTO> holds = buses.get(0).getBusHolds();
            if (isEmpty(holds)) {
                throw new RuntimeException("未找到指定预留记录");
            }
            Optional<List<Integer>> holdSeats = holds.stream().map(BusHold::getbSeat).map(this::getOperSeats).reduce(ListUtils::union);
            holdSeats.orElseThrow(() -> new RuntimeException("预留的位置信息有误,请重新确认！"));
            if (!holdSeats.get().containsAll(operSeats)) {
                throw new RuntimeException("预留的位置信息有误,请重新确认！");
            }
            //循环处理，如果包含要释放的位置，删除掉，然后更新记录
            holds.forEach(h -> {
                List<Integer> sts = getOperSeats(h.getbSeat());
                if (isEmpty(sts)) {
                    return;
                }
                if (containsAny(sts, operSeats)) {
                    List<Integer> ops = sts.stream().filter(operSeats::contains).collect(Collectors.toList());
                    if (isEmpty(ops)) {
                        return;
                    }
                    sts.removeAll(ops);
                    if (isEmpty(sts)) {
                        int i = busHoldMapper.deleteByPrimaryKey(h.getId());
                        if (i != 1) {
                            throw new RuntimeException("删除预留信息失败！");
                        }
                    } else {
                        BusHold updateHold = new BusHold();
                        updateHold.setId(h.getId());
                        updateHold.setbSeat(join(sts.iterator(), ","));
                        int i = busHoldMapper.updateByPrimaryKeySelective(updateHold);
                        if (i != 1) {
                            throw new RuntimeException("更新车辆座位预留信息失败！");
                        }
                    }
                }
            });
        }

        // 更新车辆总座位数
        Schedule s = new Schedule();
        s.setId(schedule.getId());
        if (bus.getReserve()) {
            s.setsSeatHold(schedule.getsSeatHold() + operSeats.size());
        } else {
            s.setsSeatHold(schedule.getsSeatHold() - operSeats.size());
        }
        int i = scheduleService.updateByPrimaryKeySelective(s);
        if (i != 1) {
            throw new RuntimeException("更新班期预留座位数出错了！！");
        }

    }

    @Transactional
    @Override
    public void batchSaveBusDTOs(List<Schedule> schedules, List<BusDTO> buses) {
        if (isEmpty(buses)) {
            Schedule sc = schedules.get(0);
            buses = new ArrayList<>(sc.getsCarNum());
            for (int i = 0; i < sc.getsCarNum(); i++) {
                BusDTO bd = new BusDTO();
                bd.setbSeatsNum(sc.getsCarSeats());
                buses.add(bd);
            }
        }
        List<BusDTO> busBatch = new ArrayList<>();
        List<BusHold> busHoldBatch = new ArrayList<>();

        // 车辆列表批量设置班期id
        List<BusDTO> finalBuses = buses;
        schedules.forEach(schedule -> {
            List<BusDTO> newBuses = JSON.parseObject(JSON.toJSONString(finalBuses), new TypeReference<List<BusDTO>>() {
            });
            for (int i = 0; i < newBuses.size(); i++) {
                BusDTO b = newBuses.get(i);
                b.setbScheduleId(schedule.getId());
                b.setbStatus(0);/** 状态设置为正常 */
                b.setbNo(i + 1);/** 自动设置编号 */
            }
            busBatch.addAll(newBuses);
            // bushold：id存班期id，busId存bus编号
            List<BusHold> newBusHolds = newBuses.stream().flatMap(busDTO -> {
                if (!isEmpty(busDTO.getBusHolds())) {
                    return busDTO.getBusHolds().stream().map(h -> {
                        h.setbBusId((long) busDTO.getbNo());
                        return h;
                    });
                } else {
                    return null;
                }
            }).collect(Collectors.toList());
            if (!isEmpty(newBusHolds)) {
                newBusHolds.forEach(busHold -> busHold.setId(schedule.getId()));
                busHoldBatch.addAll(newBusHolds);
            }
        });

        int i = busMapperDiy.insertBatch(busBatch);
        if (i != busBatch.size()) {
            throw new RuntimeException("批量保存车辆信息时失败了！");
        }

        if (isEmpty(busHoldBatch)) {
            return;
        }

        // 设置预留记录对应的busid
        schedules.forEach(sch ->
                busBatch.stream().filter(b -> b.getbScheduleId().equals(sch.getId())).forEach(b ->
                        busHoldBatch.stream().filter(bh -> bh.getbBusId().equals((long) b.getbNo()) && bh.getId().equals(sch.getId())).forEach(bh -> {
                            bh.setbBusId(b.getId());
                            bh.setId(null);
                        })
                )
        );

        int j = busHoldMapperDiy.insertBatch(busHoldBatch);
        if (j != busHoldBatch.size()) {
            throw new RuntimeException("批量保存预留信息时失败了！");
        }
    }

    /**
     * 根据车辆信息和预留信息，获取预留、锁住和卖出的的座位号
     */
    private TreeSet<Integer> getLockedAndReservedAndSoldSeats(List<BusDTO> buses) {
        if (isEmpty(buses)) {
            return new TreeSet<>();
        }
        List<String> st = new ArrayList<>();
        buses.forEach(busDTO -> {
            if (isNotBlank(busDTO.getbSeatsLock())) {
                st.add(busDTO.getbSeatsLock());
            }
            if (!isEmpty(busDTO.getBusHolds())) {
                busDTO.getBusHolds().forEach(busHold -> st.add(busHold.getbSeat()));
            }
            if (isNotBlank(busDTO.getSeatsSold())) {
                st.add(busDTO.getSeatsSold());
            }
        });
        return getLockedAndReservedSeatsOfStrings(st);
    }

    /**
     * 根据数据库保存字段，获取预留和锁住的座位号
     */
    private TreeSet<Integer> getLockedAndReservedSeatsOfStrings(List<String> st) {
        if (isEmpty(st)) {
            return new TreeSet<>();
        }
        Optional<List<Integer>> op = st.stream().map(this::getOperSeats).reduce(ListUtils::union);
        if (op.isPresent()) {
            Supplier<TreeSet<Integer>> supplier = TreeSet::new;
            return op.get().stream().collect(Collectors.toCollection(supplier));
        } else {
            return new TreeSet<>();
        }
    }

    private List<Integer> getOperSeats(String seats) {
        if (isBlank(seats)) {
            return new ArrayList<>();
        }
        return Arrays.stream(split(remove(seats, ' '), ',')).mapToInt(Integer::valueOf).boxed().collect(Collectors.toList());
    }

    /*删除过期的车座预留记录，更新班期预留座位数*/
    @Scheduled(initialDelay = 1000 * 70, fixedDelay = 1000 * 60)//时间间隔(秒)
    public void dealBusHoldExpire() {
        List<BusHold> list = busHoldMapperDiy.listBusHolds();
        if (isEmpty(list)) return;

        for (BusHold h : list) {
            Date d = addHours(h.getCreateTime(), h.getbHoldHours() != null ? h.getbHoldHours() : 0);
            if (d.before(new Date())) {
                Schedule s = busHoldMapperDiy.selectScheduleByHold(h);
                try {
                    updateScheduleAndRemoveHold(s, h);
                } catch (Exception e) {
                    logger.error("更新预留记录[" + h.getId() + "]时出错了：", e);
                }
            }
        }
    }

    @Transactional
    public void updateScheduleAndRemoveHold(Schedule s, BusHold h) {
        if (s == null || s.getsSeatHold() == 0) {
            busHoldMapper.deleteByPrimaryKey(h.getId());
            return;
        }

        int i = h.getbSeat().split(",").length;
        if (s.getsSeatHold() > i) {
            s.setsSeatHold(s.getsSeatHold() - i);
        } else {
            s.setsSeatHold(0);
        }
        busHoldMapper.deleteByPrimaryKey(h.getId());
        logger.info("删除预留记录【" + h.getId() + "】");
        scheduleService.updateByPrimaryKeySelective(s);
        logger.info("更新班期信息【" + JSON.toJSON(s) + "】");
    }

}
