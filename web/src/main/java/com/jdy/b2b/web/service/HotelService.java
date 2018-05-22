package com.jdy.b2b.web.service;

import com.jdy.b2b.web.pojo.hotel.Hotel;
import com.jdy.b2b.web.pojo.hotel.HotelQueryDO;
import com.jdy.b2b.web.pojo.hotel.HotelQueryVo;
import com.jdy.b2b.web.pojo.hotel.HotelSaveOrUpdateVo;
import com.jdy.b2b.web.pojo.scenicspot.HotelOrScenicDO;
import com.jdy.b2b.web.util.ResultBean;

import java.util.List;
import java.util.Map;

/**
 * Created by yangcheng on 2017/7/12.
 */
public interface HotelService {
    ResultBean queryHotelListForPage(HotelQueryVo vo);

    ResultBean<Long> saveOrUpdateHotel(HotelSaveOrUpdateVo vo);

    ResultBean<HotelQueryDO> queryForHotelById(Long id);

    ResultBean queryHotelListByArea(Integer pcType, Long pcompanyId);
}
