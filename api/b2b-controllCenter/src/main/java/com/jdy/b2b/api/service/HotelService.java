package com.jdy.b2b.api.service;



import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.hotel.Hotel;
import com.jdy.b2b.api.model.hotel.HotelQueryDO;
import com.jdy.b2b.api.model.scenicspot.HotelOrScenicAreaDO;
import com.jdy.b2b.api.model.scenicspot.HotelOrScenicDO;

import java.util.List;

/**
 * Created by yangcheng on 2017/7/7.
 */
public interface HotelService {
    List<Hotel> queryHotelListForPage(Hotel hotel);

    List<Hotel> queryHotelList(Hotel hotel,Integer cType);

    int updateHotel(Hotel hotel);

    ResultBean<Long> saveHotel(Hotel hotel);

    HotelQueryDO queryForHotelById(Long id);

    Hotel queryForHotelByName(String name);
}
