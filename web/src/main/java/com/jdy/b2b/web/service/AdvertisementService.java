package com.jdy.b2b.web.service;

import com.jdy.b2b.web.pojo.advertisement.Advertisement;
import com.jdy.b2b.web.pojo.advertisement.AdvertisementDO;
import com.jdy.b2b.web.pojo.advertisement.AdvertisementQueryVo;
import com.jdy.b2b.web.pojo.advertisement.AdvertisementSaveOrUpdateVo;
import com.jdy.b2b.web.util.ResultBean;

/**
 * Created by yangcheng on 2017/7/11.
 */
public interface AdvertisementService {
    ResultBean queryAdverListForPage(AdvertisementQueryVo vo);

    ResultBean<Long> saveOrUpdateAdvertisement(AdvertisementSaveOrUpdateVo vo);

    ResultBean<AdvertisementDO> queryForAdverById(Integer id);

    ResultBean<Long> updateAdverOnly(AdvertisementSaveOrUpdateVo vo);

    ResultBean indexAdverList(String city_code);

    ResultBean mobileAdverList(Long companyId);
}
