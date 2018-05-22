package com.jdy.b2b.api.dao.station;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.jdy.b2b.api.model.station.Station;

@Mapper
public interface StationMapper {
	int deleteByPrimaryKey(Integer stId);

	int insert(Station record);

	int insertSelective(Station record);

	Station selectByPrimaryKey(Integer stId);

	int updateByPrimaryKeySelective(Station record);

	int updateByPrimaryKey(Station record);

	/**
	 * @Description: 查询列表
	 * @author 王斌
	 * @date 2017年7月13日 上午10:39:09
	 * @param sp
	 * @return
	 */
	List<Station> queryList(Station sp);

	/**
	 * @Description: 查询列表总数
	 * @author 王斌
	 * @date 2017年7月13日 上午10:39:34
	 * @param sp
	 * @return
	 */
	int queryListCount(Station sp);
}