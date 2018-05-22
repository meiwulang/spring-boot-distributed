package com.jdy.b2b.api.dao.marketArea;

import com.jdy.b2b.api.model.marketArea.MarketArea;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MarketAreaMapper {
    int deleteByPrimaryKey(Long id);

    int insert(MarketArea record);

    int insertSelective(MarketArea record);

    MarketArea selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(MarketArea record);

    int updateByPrimaryKey(MarketArea record);

    List<MarketArea> selectByCompanyId(@Param("companyId")Long companyId);

    List<String> selectCityNamesByCompanyId(@Param("companyId")Long companyId);

    MarketArea selectByCompanyIdAndCityId(@Param("companyId") long companyId,@Param("city") String city);

    int insertList(@Param("marketAreaList") List<MarketArea> marketAreaList);

    int removeByCompanyId(@Param("companyId") long id);

    int removeByCompanyIdAndCitys(@Param("companyId") long id,@Param("citys") List<String> citys);
}