package com.jdy.b2b.api.dao.advertisement;

import com.jdy.b2b.api.model.advertisement.AdverArea;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface AdverAreaMapper {
    int deleteByPrimaryKey(Long id);

    int insert(AdverArea record);

    int insertSelective(AdverArea record);

    AdverArea selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(AdverArea record);

    int updateByPrimaryKey(AdverArea record);

    Integer saveAdverAreaBash(List<AdverArea> areaList);

    int deleteByAdverId(Long adverId);

    List<AdverArea> selectByAdverId(Long adverId);
}