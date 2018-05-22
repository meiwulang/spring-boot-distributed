package com.jdy.b2b.api.dao.station;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.jdy.b2b.api.model.station.ShuttleBus;
import com.jdy.b2b.api.model.station.Station;

@Mapper
public interface ShuttleBusMapper {
	int deleteByPrimaryKey(Long id);

	int insert(ShuttleBus record);

	int insertSelective(ShuttleBus record);

	ShuttleBus selectByPrimaryKey(Long id);

	int updateByPrimaryKeySelective(ShuttleBus record);

	int updateByPrimaryKey(ShuttleBus record);

	/**
	 * @Description: 查询列表
	 * @author 王斌
	 * @date 2017年7月13日 上午10:39:09
	 * @param sp
	 * @return
	 */
	List<Station> queryList(ShuttleBus record);

	/**
	 * @Description: 查询列表总数
	 * @author 王斌
	 * @date 2017年7月13日 上午10:39:34
	 * @param sp
	 * @return
	 */
	int queryListCount(ShuttleBus record);

	/**
	 * @Description: TODO
	 * @author 王斌
	 * @date 2017年7月17日 下午4:40:41
	 * @param sbList
	 */
	int batchSave(java.util.List<ShuttleBus> sbList);

	/**
	 * @Description: 用时间查询列表总数
	 * @author 王斌
	 * @date 2017年7月17日 下午5:27:03
	 * @param sb
	 */
	List<Long> getShuttleBusCountByTimeAndStatus(ShuttleBus sb);
}