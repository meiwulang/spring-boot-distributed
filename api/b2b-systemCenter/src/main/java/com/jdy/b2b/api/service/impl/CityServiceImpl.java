package com.jdy.b2b.api.service.impl;

import com.jdy.b2b.api.common.BaseService;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.CityMapper;
import com.jdy.b2b.api.dao.diy.CityMapperDiy;
import com.jdy.b2b.api.model.City;
import com.jdy.b2b.api.model.city.CityVo;
import com.jdy.b2b.api.service.CityService;
import com.jdy.b2b.api.vo.city.CityQueryVO;

import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.springframework.util.CollectionUtils.isEmpty;

/**
 * @Description 城市管理service
 * @Author yyf
 * @DateTime 2017/7/7 15:53
 */
@Service
public class CityServiceImpl extends BaseService implements CityService {
    @Autowired
    CityMapper cityMapper;
    @Autowired
    CityMapperDiy cityMapperDiy;

    /**
     * 投放城市查询，返回含有满足条件（关闭或开放）的城市的省份
     */
    @Override
    public List<CityVo> selectCityPutList(CityQueryVO c) {
        List<CityVo> cities = cityMapperDiy.selectCityPutList(c,c.getSearchStr());
        return  cities;
    }

    @Transactional
    @Override
    public ResultBean updateCityOpenStatus(List<City> cities) {

        /** 开放 */
        List openCities = cities.stream().filter(City::getIsopen).collect(Collectors.toList());
        if (!isEmpty(openCities)) {
            Map<String, Object> openMap = new HashMap<>();
            openMap.put("isopen", 1);
            openMap.put("list", openCities);
            int res = cityMapperDiy.updateCityOpenStatus(openMap);
            if (res != openCities.size()) {
                throw new RuntimeException("更新投放城市列表失败！");
            }
        }

        /** 关闭 */
        List closeCities = cities.stream().filter(item -> !item.getIsopen()).collect(Collectors.toList());
        if (!isEmpty(closeCities)) {
            Map<String, Object> closeMap = new HashMap<>();
            closeMap.put("isopen", 0);
            closeMap.put("list", closeCities);
            int res = cityMapperDiy.updateCityOpenStatus(closeMap);
            if (res != closeCities.size()) {
                throw new RuntimeException("更新投放城市列表失败！");
            }
        }
        return ResultBean.getSuccessResult();
    }

    @Override
    public List<City> selectCities(City city) {
        return cityMapperDiy.selectCities(city);
    }
    /** 
     * @Description: 获取全部大洲
     * @author 王斌
     * @date 2018年5月11日 下午1:53:32
     * @return
     */
    public  List<HashMap<String, Object>> getContinents(){return cityMapper.getContinents();}
    /** 
     * @Description: 大洲下的国家
     * @author 王斌
     * @date 2018年5月11日 下午1:53:32
     * @return
     */
    public  List<HashMap<String, Object>> getCountriesByPid (Long pid){return cityMapper.getCountriesByPid(pid);}
}
