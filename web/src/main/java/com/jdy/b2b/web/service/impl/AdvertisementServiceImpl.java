package com.jdy.b2b.web.service.impl;

import com.jdy.b2b.web.pojo.advertisement.Advertisement;
import com.jdy.b2b.web.pojo.advertisement.AdvertisementDO;
import com.jdy.b2b.web.pojo.advertisement.AdvertisementQueryVo;
import com.jdy.b2b.web.pojo.advertisement.AdvertisementSaveOrUpdateVo;
import com.jdy.b2b.web.service.AdvertisementService;
import com.jdy.b2b.web.service.SalerCountService;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by yangcheng on 2017/7/11.
 */
@Service
public class AdvertisementServiceImpl extends BaseService implements AdvertisementService {
    @Override
    public ResultBean queryAdverListForPage(AdvertisementQueryVo vo) {
        StringBuffer url = new StringBuffer(systemCenterUrl).append("advertisement/list");
        return restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
    }

    @Override
    public ResultBean<Long> saveOrUpdateAdvertisement(AdvertisementSaveOrUpdateVo vo) {
        StringBuffer url = new StringBuffer(systemCenterUrl).append("advertisement/saveOrUpdate");
        return restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
    }

    @Override
    public ResultBean<AdvertisementDO> queryForAdverById(Integer id) {
        StringBuffer url = new StringBuffer(systemCenterUrl).append("advertisement/get/").append(id);
        return restTemplate.getForEntity(url.toString(), ResultBean.class).getBody();
    }

    @Override
    public ResultBean<Long> updateAdverOnly(AdvertisementSaveOrUpdateVo vo) {
        StringBuffer url = new StringBuffer(systemCenterUrl).append("advertisement/updateAdverOnly");
        return restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
    }

    @Override
    public ResultBean indexAdverList(String city_code) {
        StringBuffer url = new StringBuffer(systemCenterUrl).append("advertisement/indexAdverList?city_code={city_code}");
        return restTemplate.getForEntity(url.toString(),ResultBean.class,city_code).getBody();
    }

    @Override
    public ResultBean mobileAdverList(Long companyId) {
        StringBuffer url = new StringBuffer(systemCenterUrl).append("advertisement/mobileAdverList?companyId={companyId}");
        return restTemplate.getForEntity(url.toString(),ResultBean.class,companyId).getBody();
    }
}
