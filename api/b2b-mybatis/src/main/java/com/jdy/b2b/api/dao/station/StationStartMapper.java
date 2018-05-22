package com.jdy.b2b.api.dao.station;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.jdy.b2b.api.model.station.StationStart;

@Mapper
public interface StationStartMapper {
	int deleteByPrimaryKey(Integer sdId);

	int insert(StationStart record);

	int insertSelective(StationStart record);

	StationStart selectByPrimaryKey(Integer sdId);

	int updateByPrimaryKeySelective(StationStart record);

	int updateByPrimaryKey(StationStart record);

	/**
	 * @Description: 查询始发站列表
	 * @author 王斌
	 * @date 2017年7月10日 上午10:00:10
	 * @param t
	 */
	List<Map<String, Object>> queryList(StationStart t);

	/**
	 * @Description: 查询始发站列表总数
	 * @author 王斌
	 * @date 2017年7月10日 上午10:01:08
	 * @param t
	 */
	int queryListCount(StationStart t);

	/**
	 * @Description: 查询名称的总数
	 * @author 王斌
	 * @date 2017年7月10日 上午10:01:08
	 * @param t
	 */
	int countBysdName(StationStart t);

	/**
	 * @Description: 按名称查找
	 * @author 王斌
	 * @date 2017年7月10日 上午10:01:08
	 * @param t
	 */
	List<StationStart> queryBysdName(StationStart t);
}