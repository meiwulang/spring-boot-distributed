package com.jdy.b2b.api.dao.diy;

import com.alibaba.fastjson.JSON;
import com.jdy.b2b.api.model.Bus;
import com.jdy.b2b.api.model.Order;
import com.jdy.b2b.api.model.diy.BusDTO;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.apache.commons.lang3.StringUtils.isNotBlank;
import static org.apache.commons.lang3.StringUtils.join;
import static org.apache.commons.lang3.time.DateUtils.addHours;
import static org.springframework.util.CollectionUtils.isEmpty;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/10/25 18:00
 */
@Component
public class BusMapperExtDiyImpl implements BusMapperExtDiy {

    @Autowired
    BusMapperDiy busMapperDiy;
    @Autowired
    OrderMapperDiy orderMapperDiy;

    @Override
    public List<BusDTO> selectBusAndHolds(Bus bus) {
        //排除掉预留过期的
        List<BusDTO> buses = busMapperDiy.selectBusAndHolds(bus);
        removeHoldsOutOfDate(buses);
        return buses;
    }

    private void removeHoldsOutOfDate(List<BusDTO> buses) {
        if (!isEmpty(buses)) {
            buses.forEach(b -> {
                if (!isEmpty(b.getBusHolds())) {
                    b.setBusHolds(b.getBusHolds().stream().filter(h -> {
                        Date d = addHours(h.getCreateTime(), h.getbHoldHours() != null ? h.getbHoldHours() : 0);
                        if (d.before(new Date())) {
                            return false;
                        } else {
                            return true;
                        }
                    }).collect(Collectors.toList()));
                }
            });
        }
    }

    @Override
    public List<BusDTO> selectBusAndHoldsAndSold(Bus bus) {
        List<BusDTO> buses = selectBusAndHolds(bus);
        //设置每辆车卖出的座位数和座位
        if (!isEmpty(buses)) {
            Order o = new Order();
            o.setoScheduleId(buses.get(0).getbScheduleId());
            List<Order> orders = orderMapperDiy.selectOrdersSelective(o);
            List<Order> nOrders = JSON.parseArray(JSON.toJSONString(orders), Order.class);
            buses.forEach(b -> {
                String[] sts = nOrders.stream().filter(od -> isNotBlank(od.getoBusSeat())).map(od -> {
                    List<Map> seats = JSON.parseArray(od.getoBusSeat(), Map.class);
                    return seats.stream().filter(m -> b.getId().equals(Long.parseLong(m.get("busId").toString()))).map(m -> (String) m.get("seat")).findFirst().orElse("");
                }).filter(StringUtils::isNotBlank).map(seat -> (seat.split(","))).reduce(ArrayUtils::addAll).orElse(ArrayUtils.EMPTY_STRING_ARRAY);
                if (!ArrayUtils.isEmpty(sts)) {
                    b.setSeatsSoldNum(sts.length);
                    b.setSeatsSold(join(sts, ","));
                }
            });
        }
        return buses;
    }
}
