package com.jdy.b2b.api.controller;

import com.jdy.b2b.api.common.BaseController;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.City;
import com.jdy.b2b.api.model.city.CityVo;
import com.jdy.b2b.api.service.CityService;
import com.jdy.b2b.api.vo.city.CityQueryVO;

import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Description 城市管理controller
 * @Author yyf
 * @DateTime 2017/7/7 15:51
 */
@RestController
@RequestMapping("City")
public class CityController extends BaseController {
    @Autowired
    CityService cityService;

    @PostMapping("/selectCityPutList")
    public ResultBean selectCityPutList(@RequestBody CityQueryVO cityVO) {
        List<CityVo> list = cityService.selectCityPutList(cityVO);
        return ResultBean.getSuccessResult(list);
    }

    /**
     * @Description City必传id，isopen；省市级必须一起传入，省级状态有可能改变，省级更新状态由接口调用方判断
     */
    @PostMapping("/openCities")
    public ResultBean openCities(@RequestBody List<City> cities) {
        return cityService.updateCityOpenStatus(cities);
    }

    /**
     * 分级别查询省市县信息,查询参数level,type,pid
     */
    @PostMapping("/selectCities")
    public ResultBean selectCities(@RequestBody City city) {
        List list = cityService.selectCities(city);
        return ResultBean.getSuccessResult(list);
    }
    /** 
     * @Description: 获取全部大洲
     * @author 王斌
     * @date 2018年5月11日 下午1:53:32
     * @return
     */
    @PostMapping("/getContinents")
    public ResultBean getContinents(){return ResultBean.getSuccessResult(cityService.getContinents());}
    /** 
     * @Description: 大洲下的国家
     * @author 王斌
     * @date 2018年5月11日 下午1:53:32
     * @return
     */
    @PostMapping("/getCountriesByPid")
    public ResultBean getCountriesByPid (@RequestBody Long pid){return ResultBean.getSuccessResult(cityService.getCountriesByPid(pid));}
}
