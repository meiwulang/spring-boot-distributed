package com.jdy.b2b.api.dao.advertisement;

import com.jdy.b2b.api.model.advertisement.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Mapper
public interface AdvertisementMapper {
    int deleteByPrimaryKey(Long id);

    long insert(Advertisement record);

    int insertSelective(Advertisement record);

    AdvertisementDO selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Advertisement record);

    int updateByPrimaryKey(Advertisement record);
	
	/*自定义*/

	List<AdvertisementListDO> queryAdverListForPage(Advertisement record);


    List<IndexAdverDO> indexAdverList(@Param("companyId") Long companyId);
}