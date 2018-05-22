package com.jdy.b2b.web.service.impl;

import com.jdy.b2b.web.pojo.scenicspot.*;
import com.jdy.b2b.web.service.ScenicService;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Created by yangcheng on 2017/7/12.
 */
@Service
public class ScenicServiceImpl extends BaseService implements ScenicService{
    @Override
    public ResultBean<ScenicSpotQueryDO> queryForScenicById(Long id) {
        StringBuffer url = new StringBuffer(controllCenterUrl).append("scenic_spot/get/").append(id);
        return restTemplate.getForEntity(url.toString(), ResultBean.class).getBody();
    }

    @Override
    public ResultBean queryScenicListForPage(ScenicSpotQueryVo vo) {
        StringBuffer url = new StringBuffer(controllCenterUrl).append("scenic_spot/list");
        return restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
    }

    @Override
    public ResultBean<Long> saveOrUpdateScenic(ScenicSpotSaveOrUpdateVo vo) {
        StringBuffer url = new StringBuffer(controllCenterUrl).append("scenic_spot/saveOrUpdate");
        return restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
    }

    @Override
    public ResultBean<ScenicSpot> queryForScenicByName(String name) {
        StringBuffer url = new StringBuffer(controllCenterUrl).append("scenic_spot/name/").append(name);
        return restTemplate.getForEntity(url.toString(), ResultBean.class).getBody();
    }

    @Override
    public ResultBean<Map> queryForCityListByOrgId(Integer cType, Long companyId) {
        StringBuffer url = new StringBuffer(controllCenterUrl).append("scenic_spot/cityList/").append(cType).append("/").append(companyId);
        return restTemplate.getForEntity(url.toString(), ResultBean.class).getBody();
    }
    @Override
    public ResultBean<List<HotelOrScenicDO>> queryScenicList(Integer cType, String cityName, Long companyId) {
        StringBuffer url = new StringBuffer(controllCenterUrl).append("scenic_spot/nameList/")
                .append(cType).append("/").append(cityName)
                .append("/").append(companyId);
        return restTemplate.getForEntity(url.toString(), ResultBean.class).getBody();
    }

    @Override
    public ResultBean queryScenicListByArea(Integer pcType, Long pcompanyId) {
        StringBuffer url = new StringBuffer(controllCenterUrl).append("scenic_spot/scenicList/").append(pcType).append("/").append(pcompanyId);
        return restTemplate.getForEntity(url.toString(), ResultBean.class).getBody();
    }


}
