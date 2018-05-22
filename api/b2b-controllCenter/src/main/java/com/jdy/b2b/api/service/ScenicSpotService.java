package com.jdy.b2b.api.service;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.scenicspot.HotelOrScenicAreaDO;
import com.jdy.b2b.api.model.scenicspot.HotelOrScenicDO;
import com.jdy.b2b.api.model.scenicspot.ScenicSpot;
import com.jdy.b2b.api.model.scenicspot.ScenicSpotQueryDO;

import java.util.List;

/**
 * Created by yangcheng on 2017/7/7.
 */
public interface ScenicSpotService {
    List<ScenicSpot> queryScenicListForPage(ScenicSpot scenic);

    int updateScenic(ScenicSpot scenic);

    ResultBean<Long> saveScenic(ScenicSpot scenic);

    ScenicSpotQueryDO queryForScenicById(Long id);

    List<HotelOrScenicAreaDO> queryForCityListByOrgId(Integer cType, Long orgId);

    ScenicSpot queryForScenicByName(String name);

    List<ScenicSpot> queryScenicList(ScenicSpot scenic,Integer cType);

}
