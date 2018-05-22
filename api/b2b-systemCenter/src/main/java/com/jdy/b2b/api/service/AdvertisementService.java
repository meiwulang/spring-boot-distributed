package com.jdy.b2b.api.service;

import com.jdy.b2b.api.model.advertisement.*;
import com.jdy.b2b.api.vo.advertisement.AdvertisementSaveOrUpdateVo;

import java.util.List;
import java.util.Map;

/**
 * Created by ASUS on 2017/7/3.
 */
public interface AdvertisementService {

    List<AdvertisementListDO> queryAdverListForPage(Advertisement adver);

    int updateAdver(Advertisement adver,Long userId);

    long saveAdver(Advertisement adver,Long userId);

    AdvertisementDO queryForAdverById(Long id);

    int updateAdverOnly(Advertisement advertisement);

    //Map<String,List<IndexAdverDO>> indexAdverList(String city_code);

    List<IndexAdverDO> mobileAdverList(Long companyId);
}
