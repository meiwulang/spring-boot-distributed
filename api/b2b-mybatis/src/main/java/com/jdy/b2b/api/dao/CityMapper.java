package com.jdy.b2b.api.dao;

import com.jdy.b2b.api.model.City;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface CityMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(City record);

    int insertSelective(City city);

    City selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(City city);

    int updateByPrimaryKey(City city);
    /** 
     * @Description: 获取全部大洲
     * @author 王斌
     * @date 2018年5月11日 下午1:53:32
     * @return
     */
    List<HashMap<String, Object>> getContinents();
    /** 
     * @Description: 大洲下的国家
     * @author 王斌
     * @date 2018年5月11日 下午1:53:32
     * @return
     */
    List<HashMap<String, Object>> getCountriesByPid (@Param("pid") Long pid);
}