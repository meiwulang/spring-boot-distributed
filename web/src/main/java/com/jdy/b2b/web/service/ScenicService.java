package com.jdy.b2b.web.service;

import com.jdy.b2b.web.pojo.scenicspot.*;
import com.jdy.b2b.web.util.ResultBean;

import java.util.List;
import java.util.Map;

/**
 * Created by yangcheng on 2017/7/12.
 */
public interface ScenicService {

    ResultBean<ScenicSpotQueryDO> queryForScenicById(Long id);

    ResultBean queryScenicListForPage(ScenicSpotQueryVo vo);

    ResultBean<Long> saveOrUpdateScenic(ScenicSpotSaveOrUpdateVo vo);

    ResultBean<ScenicSpot> queryForScenicByName(String name);

    ResultBean<Map> queryForCityListByOrgId(Integer cType, Long companyId);

    ResultBean<List<HotelOrScenicDO>> queryScenicList(Integer cType, String cityName, Long companyId);

    ResultBean queryScenicListByArea(Integer pcType, Long pcompanyId);
}
