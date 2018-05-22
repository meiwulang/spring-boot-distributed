package com.jdy.b2b.api.dao.diy;

import com.jdy.b2b.api.model.Bus;
import com.jdy.b2b.api.model.diy.BusDTO;

import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/10/25 17:59
 */
public interface BusMapperExtDiy {

    List<BusDTO> selectBusAndHoldsAndSold(Bus bus);

    List<BusDTO> selectBusAndHolds(Bus bus);

}
