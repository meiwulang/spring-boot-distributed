package com.jdy.b2b.web.service.impl;

import com.jdy.b2b.web.pojo.hotel.Hotel;
import com.jdy.b2b.web.pojo.hotel.HotelQueryDO;
import com.jdy.b2b.web.pojo.hotel.HotelQueryVo;
import com.jdy.b2b.web.pojo.hotel.HotelSaveOrUpdateVo;
import com.jdy.b2b.web.pojo.pic.PicVO;
import com.jdy.b2b.web.pojo.scenicspot.HotelOrScenicDO;
import com.jdy.b2b.web.service.HotelService;
import com.jdy.b2b.web.service.PicService;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.Constants;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Created by yangcheng on 2017/7/12.
 */
@Service
public class HotelServiceImpl extends BaseService implements HotelService{


    @Override
    public ResultBean queryHotelListForPage(HotelQueryVo vo) {
        StringBuffer url = new StringBuffer(controllCenterUrl).append("hotel/list");
        return restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
    }


    @Override
    public ResultBean<Long> saveOrUpdateHotel(HotelSaveOrUpdateVo vo) {

        StringBuffer url = new StringBuffer(controllCenterUrl).append("hotel/saveOrUpdate");
        return  restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();

    }

    @Override
    public ResultBean<HotelQueryDO> queryForHotelById(Long id) {
        StringBuffer url = new StringBuffer(controllCenterUrl).append("hotel/get/").append(id);
        return restTemplate.getForEntity(url.toString(), ResultBean.class).getBody();
    }
    //hotelList/{cType}/{companyId}
    @Override
    public ResultBean queryHotelListByArea(Integer pcType, Long pcompanyId) {
        StringBuffer url = new StringBuffer(controllCenterUrl).append("hotel/hotelList/").append(pcType).append("/").append(pcompanyId);
        return restTemplate.getForEntity(url.toString(), ResultBean.class).getBody();
    }


}
