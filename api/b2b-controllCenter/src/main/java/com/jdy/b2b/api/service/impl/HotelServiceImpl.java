package com.jdy.b2b.api.service.impl;

import com.jdy.b2b.api.common.BaseService;
import com.jdy.b2b.api.common.Constants;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.hotel.HotelMapper;
import com.jdy.b2b.api.model.hotel.Hotel;
import com.jdy.b2b.api.model.hotel.HotelQueryDO;
import com.jdy.b2b.api.model.scenicspot.HotelOrScenicAreaDO;
import com.jdy.b2b.api.model.scenicspot.HotelOrScenicDO;
import com.jdy.b2b.api.service.AttachService;
import com.jdy.b2b.api.service.HotelService;
import com.jdy.b2b.api.vo.pic.AlbumVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * Created by yangcheng on 2017/7/7.
 */
@Service
public class HotelServiceImpl extends BaseService implements HotelService {
    @Autowired
    private HotelMapper hotelMapper;
    @Autowired
    private AttachService attachService;
//    @Value("${attach.cover.hotel.url}")
//    private String defaultHotelAlbumCover;

    @Override
    public List<Hotel> queryHotelListForPage(Hotel hotel) {
        return hotelMapper.queryHotelListForPage(hotel);
    }

    @Override
    public List<Hotel> queryHotelList(Hotel hotel,Integer cType) {
        return hotelMapper.queryHotelList(hotel,cType);
    }

    @Override
    public int updateHotel(Hotel hotel) {
        return hotelMapper.updateByPrimaryKeySelective(hotel);
    }

    @Override
    @Transactional
    public ResultBean<Long> saveHotel(Hotel hotel) {
        int result =  hotelMapper.insert(hotel);

         /*新增酒店的同时创建相册*/
        Long id = hotel.getId();
        AlbumVO vo = new AlbumVO();
        vo.setCompanyId(hotel.getCompanyId());
        vo.setaCity(hotel.gethCity());
        vo.setaType(Constants.ALBUM_TYPE_HOTEL);
        vo.setaPid(id);
        vo.setaName(hotel.gethName());
//        vo.setpOssName(defaultHotelAlbumCover);
        vo.setpSize(1L);
        ResultBean<Map<String, Object>> mapResultBean = attachService.saveAlbum(vo);
        Long albumId = (Long)mapResultBean.getBody().get(Constants.Fields.ID);
        if(result>0 && albumId!=null){
            return ResultBean.getSuccessResult(albumId);

        }else{
            throw new RuntimeException("保存酒店失败");
        }

    }

    @Override
    public HotelQueryDO queryForHotelById(Long id) {
        return hotelMapper.selectByPrimaryKey(id);
    }

    @Override
    public Hotel queryForHotelByName(String name) {
        return hotelMapper.selectByName(name);
    }
}
