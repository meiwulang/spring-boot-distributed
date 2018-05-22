package com.jdy.b2b.api.dao.diy;

import com.jdy.b2b.api.model.Bus;
import com.jdy.b2b.api.model.diy.BusDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/24 10:45
 */
@Mapper
public interface BusMapperDiy {

    List<Bus> selectBusList(Bus bus);

    List<BusDTO> selectBusAndHolds(Bus bus);

    int insertBatch(List<BusDTO> buses);

}
