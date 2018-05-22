package com.jdy.b2b.api.service;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.City;
import com.jdy.b2b.api.model.city.CityVo;
import com.jdy.b2b.api.vo.city.CityQueryVO;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

/**
 * Created by Admin on 2017/7/7.
 */
public interface CityService {
    /**
     * 投放城市列表
     */
    List<CityVo> selectCityPutList(CityQueryVO cityVO);

    /**
     * 更新城市isopen状态
     */
    ResultBean updateCityOpenStatus(List<City> cities);

    /**
     * 分级别查询省市县信息,查询参数level,type,pid
     */
    List<City> selectCities(City city);
    /** 
     * @Description: 获取全部大洲
     * @author 王斌
     * @date 2018年5月11日 下午1:53:32
     * @return
     */
    List<HashMap<String, Object>> getContinents();
    /** 
     * @Description: 大洲下的国家
     * @author 王斌
     * @date 2018年5月11日 下午1:53:32
     * @return
     */
    List<HashMap<String, Object>> getCountriesByPid (@Param("pid") Long pid);
}
