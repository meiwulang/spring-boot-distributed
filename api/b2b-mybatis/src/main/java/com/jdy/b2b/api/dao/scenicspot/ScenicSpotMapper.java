package com.jdy.b2b.api.dao.scenicspot;

import com.jdy.b2b.api.model.scenicspot.HotelOrScenicAreaDO;
import com.jdy.b2b.api.model.scenicspot.HotelOrScenicDO;
import com.jdy.b2b.api.model.scenicspot.ScenicSpot;
import com.jdy.b2b.api.model.scenicspot.ScenicSpotQueryDO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ScenicSpotMapper {
    int deleteByPrimaryKey(Long id);

    int insert(ScenicSpot record);

    int insertSelective(ScenicSpot record);

    ScenicSpotQueryDO selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(ScenicSpot record);

    int updateByPrimaryKeyWithBLOBs(ScenicSpot record);

    int updateByPrimaryKey(ScenicSpot record);
	 /*自定义*/

    List<ScenicSpot> queryScenicListForPage(ScenicSpot scenic);

    ScenicSpot selectByName(String name);

    List<HotelOrScenicAreaDO> queryForCityListByOrgId(@Param("cType") Integer cType, @Param("companyId") Long companyId);

    List<ScenicSpot> queryScenicList(@Param("scenic") ScenicSpot scenic,@Param("cType")Integer cType);

}