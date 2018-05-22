package com.jdy.b2b.api.dao.diy;

import com.jdy.b2b.api.model.City;
import com.jdy.b2b.api.model.city.CityVo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface CityMapperDiy {
    /*投放城市列表*/
    List<CityVo> selectCityPutList(@Param("city") City city, @Param("cityStr") String cityStr);

    /*更新城市isopen状态,Map<Integer isopen,List<Integer> ids>*/
    int updateCityOpenStatus(Map map);

    List<City> selectCities(City city);

}