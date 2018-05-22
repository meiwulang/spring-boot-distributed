package com.jdy.b2b.api.dao.station;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.jdy.b2b.api.model.station.StationPrice;

@Mapper
public interface StationPriceMapper {
	int deleteByPrimaryKey(Integer spId);

	int insert(StationPrice record);

	int insertSelective(StationPrice record);

	StationPrice selectByPrimaryKey(Integer spId);

	int updateByPrimaryKeySelective(StationPrice record);

	int updateByPrimaryKey(StationPrice record);

	/**
	 * @Description: 查询列表
	 * @author 王斌
	 * @date 2017年7月13日 上午10:57:12
	 * @param sp
	 * @return
	 */
	List<StationPrice> queryList(StationPrice sp);

	/**
	 * @Description: 查询列表总数
	 * @author 王斌
	 * @date 2017年7月13日 上午10:57:43
	 * @param sp
	 * @return
	 */
	int queryListCount(StationPrice sp);
}