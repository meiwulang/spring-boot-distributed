package com.jdy.b2b.api.dao.hotel;

import com.jdy.b2b.api.model.hotel.Hotel;
import com.jdy.b2b.api.model.hotel.HotelQueryDO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface HotelMapper {
    int deleteByPrimaryKey(Long id);

    int insert(Hotel record);

    int insertSelective(Hotel record);

    HotelQueryDO selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Hotel record);

    int updateByPrimaryKey(Hotel record);
	
	/*自定义*/

    List<Hotel> queryHotelListForPage(Hotel hotel);

    Hotel selectByName(String name);

    List<Hotel> queryHotelList(@Param("hotel") Hotel hotel,@Param("cType") Integer cType);
}